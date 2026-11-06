<?php

declare(strict_types=1);

namespace App\Application\Queries\PedagogicalRecords;

use App\Application\Queries\Sessions\SessionFormQuery;
use App\Domain\Enums\AttendanceType;
use App\Domain\Enums\SessionStatus;
use App\Domain\Exceptions\InvalidPedagogicalRecord;
use App\Domain\Models\Guardian;
use App\Domain\Models\PedagogicalRecord;
use App\Domain\Models\Session;
use Carbon\Carbon;

final readonly class PedagogicalRecordFormQuery
{
    public function __construct(
        private SessionFormQuery $sessionForm,
    ) {}

    public function forCreation(Session $session, int $professionalId): array
    {
        $session->load([
            'students.guardians.person',
            'professional.person',
            'aeeRecord',
            'pedagogicalRecord',
        ]);
        foreach ($session->students as $student) {
            $student->ensureNotInIntake();
        }
        if ((int) $session->professional_id !== $professionalId || ! AttendanceType::isPedagogical($session->attendance_type) || ! SessionStatus::isScheduledValue($session->status) || ! $session->sessionDateHasArrived() || $session->students->count() !== 1 || $session->aeeRecord !== null || $session->pedagogicalRecord !== null) {
            throw new InvalidPedagogicalRecord('Este agendamento não está disponível para criação de registro pedagógico.');
        }

        return [
            'session' => $session,
            'context' => $this->context($session),
        ];
    }

    /** Registro direto, sem agendamento prévio: o profissional é o usuário logado. */
    public function forDirectCreation(int $professionalId): array
    {
        return $this->sessionForm->forDirectRecord(AttendanceType::PEDAGOGICAL, $professionalId);
    }

    public function forUpdate(PedagogicalRecord $pedagogicalRecord, int $professionalId): array
    {
        $pedagogicalRecord->load([
            'attendanceSession.students.guardians.person',
            'attendanceSession.professional.person',
            'guardians.person',
        ]);
        if ((int) $pedagogicalRecord->attendanceSession->professional_id !== $professionalId) {
            throw new InvalidPedagogicalRecord('Apenas o profissional vinculado pode editar este registro pedagógico.');
        }

        return [
            'pedagogicalRecord' => $pedagogicalRecord,
            'context' => $this->context($pedagogicalRecord->attendanceSession),
        ] + $this->sessionForm->forAttendanceCorrection($pedagogicalRecord->attendanceSession);
    }

    /**
     * Dados de identificação exibidos pelo formulário, no mesmo formato do Blade legado.
     *
     * @return array<string, mixed>
     */
    private function context(Session $session): array
    {
        $student = $session->students->first();
        $guardians = $student?->guardians?->sortBy('person.name')->values() ?? collect();

        return [
            'session_id' => (int) $session->id,
            'session_objective' => $session->session_objective,
            'student_id' => $student !== null ? (int) $student->getKey() : null,
            'student_name' => $student?->person?->name,
            'professional_id' => (int) $session->professional_id,
            'professional_name' => $session->professional?->person?->name,
            'session_date' => $session->session_date?->format('d/m/Y'),
            'start_time' => Carbon::parse($session->start_time)->format('H:i'),
            'end_time' => $session->end_time ? Carbon::parse($session->end_time)->format('H:i') : null,
            'attendance_type_label' => AttendanceType::labelFor($session->attendance_type),
            'guardians' => $guardians
                ->map(fn (Guardian $guardian): array => [
                    'id' => (int) $guardian->id,
                    'name' => (string) $guardian->person?->name,
                    'relationship_label' => $guardian->relationshipLabel(),
                ])
                ->all(),
        ];
    }
}
