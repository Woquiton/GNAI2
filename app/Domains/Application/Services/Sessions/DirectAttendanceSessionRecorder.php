<?php

declare(strict_types=1);

namespace App\Domains\Application\Services\Sessions;

use App\Domains\Domain\DTOs\Sessions\CreateSessionDTO;
use App\Domains\Domain\Enums\Sessions\AttendanceType;
use App\Domains\Domain\Enums\Sessions\SessionOrigin;
use App\Domains\Domain\Enums\Sessions\SessionType;
use App\Domains\Domain\Models\Sessions\Session;
use Carbon\Carbon;
use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * Agendamento que acompanha um atendimento registrado diretamente, sem agendamento prévio. Ele
 * passa pelas mesmas validações do módulo de agendamentos (alunos ativos e compatíveis, profissional
 * ativo e com permissão, conflito de horário) e mantém o histórico, o calendário, os relatórios e o
 * PEI lendo do mesmo lugar.
 */
final readonly class DirectAttendanceSessionRecorder
{
    public function __construct(
        private SessionSchedulingValidator $validator,
    ) {}

    /**
     * Cria o agendamento e, na mesma transação, o registro do atendimento por `$register`. O
     * agendamento nasce como Agendada para passar pelas regras de criação do registro, que o
     * concluem; se o registro falhar, nada é gravado.
     *
     * @template TRecord
     *
     * @param  array{student_ids: list<int>, type: string, session_date: string, start_time: string, end_time: ?string, location: string, session_objective: string}  $details
     * @param  Closure(Session): TRecord  $register
     * @return TRecord
     *
     * @throws Throwable
     */
    public function record(AttendanceType $attendanceType, array $details, int $professionalId, int $creatorId, Closure $register): mixed
    {
        $payload = $this->validator->normalize([
            ...$details,
            'professional_id' => $professionalId,
            'attendance_type' => $attendanceType->value,
        ]);

        // Mesma chave do cadastro de agendamentos: impede dois registros simultâneos no horário.
        $lock = Cache::lock('sessions:create:'.sha1(json_encode([
            'professional_id' => $payload['professional_id'],
            'student_ids' => $payload['student_ids'],
            'session_date' => $payload['session_date'],
            'start_time' => $payload['start_time'],
            'end_time' => $payload['end_time'],
        ], JSON_THROW_ON_ERROR)), 10);

        if (! $lock->get()) {
            throw ValidationException::withMessages([
                'start_time' => 'Este atendimento já está sendo processado. Aguarde alguns segundos e tente novamente.',
            ]);
        }

        try {
            return DB::transaction(function () use ($payload, $creatorId, $register): mixed {
                $this->withProfessionalErrorsOnSchedule(fn () => $this->validator->validateForCreation($payload));

                $session = Session::schedule(new CreateSessionDTO(
                    professionalId: (int) $payload['professional_id'],
                    creatorId: $creatorId,
                    studentIds: $payload['student_ids'],
                    sessionDate: (string) $payload['session_date'],
                    startTime: (string) $payload['start_time'],
                    endTime: (string) $payload['end_time'],
                    type: SessionType::from((string) $payload['type']),
                    attendanceType: AttendanceType::from((string) $payload['attendance_type']),
                    location: (string) $payload['location'],
                    sessionObjective: (string) $payload['session_objective'],
                    origin: SessionOrigin::DIRECT_RECORD,
                ));
                $session->save();
                $session->syncStudents($payload['student_ids']);

                return $register($session);
            });
        } finally {
            try {
                $lock->release();
            } catch (Throwable) {
                // O lock pode expirar antes da liberação; o registro já terminou.
            }
        }
    }

    /**
     * Corrige data, horário e local pela edição do registro. Só o conflito de horário é conferido
     * de novo, e apenas quando data ou horário mudam: a situação atual de alunos e profissional não
     * invalida um atendimento já realizado, e um registro antigo continua editável como estava.
     *
     * @param  array{session_date: string, start_time: string, end_time: ?string, location: string}  $details
     */
    public function correct(Session $session, array $details): void
    {
        $sessionDate = Carbon::parse($details['session_date'])->toDateString();
        $startTime = Carbon::parse($details['start_time'])->format('H:i');
        $endTime = empty($details['end_time'])
            ? Carbon::parse($startTime)->addHour()->format('H:i')
            : Carbon::parse($details['end_time'])->format('H:i');
        $scheduleChanged = $sessionDate !== $session->session_date?->toDateString()
            || $startTime !== Carbon::parse($session->start_time)->format('H:i')
            || $endTime !== ($session->end_time ? Carbon::parse($session->end_time)->format('H:i') : null);

        if ($scheduleChanged) {
            $session->loadMissing('students');
            $this->withProfessionalErrorsOnSchedule(fn () => $this->validator->ensureNoConflict([
                'professional_id' => (int) $session->professional_id,
                'student_ids' => $session->students->pluck('id')->map(fn (mixed $id): int => (int) $id)->all(),
                'session_date' => $sessionDate,
                'start_time' => $startTime,
                'end_time' => $endTime,
            ], (int) $session->getKey()));
        }

        $session->correctAttendanceDetails($sessionDate, $startTime, $endTime, $details['location']);
        $session->save();
    }

    /**
     * O profissional é sempre o usuário logado e não aparece como campo no registro: os erros
     * dele (inativo, sem permissão, horário ocupado) são apresentados junto do horário.
     *
     * @param  Closure(): void  $validate
     */
    private function withProfessionalErrorsOnSchedule(Closure $validate): void
    {
        try {
            $validate();
        } catch (ValidationException $exception) {
            $errors = $exception->errors();

            if (! array_key_exists('professional_id', $errors)) {
                throw $exception;
            }

            $errors['start_time'] = [...($errors['start_time'] ?? []), ...$errors['professional_id']];
            unset($errors['professional_id']);

            throw ValidationException::withMessages($errors);
        }
    }
}
