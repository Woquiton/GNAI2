<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\AeeRecords;

use App\Domains\Application\Data\Sessions\Concerns\ValidatesAttendanceDetails;
use App\Domains\Domain\Enums\Sessions\SessionType;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Registro de um atendimento AEE já realizado sem agendamento prévio: o cabeçalho do agendamento
 * (data, horário, local, formato e alunos) chega junto do registro e das avaliações. As atividades
 * planejadas/realizadas também são o objetivo do agendamento, sem pedir o mesmo texto duas vezes.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class CreateDirectAeeRecordData extends Data
{
    use ValidatesAttendanceDetails;

    /**
     * @param  list<int>  $studentIds
     */
    public function __construct(
        public array $studentIds,
        public SessionType $type,
        public string $sessionDate,
        public string $startTime,
        public ?string $endTime,
        public string $location,
        public string $duration,
        public string $activitiesPerformed,
        public ?string $strategiesUsed,
        public ?string $resourcesUsed,
        public ?string $generalObservations,
        public array $evaluations,
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        return CreateAeeRecordData::prepareForPipeline($properties);
    }

    public static function rules(): array
    {
        return [
            ...self::attendanceStudentsRules(),
            'type' => ['required', Rule::enum(SessionType::class)],
            ...self::attendanceDetailsRules(),
            ...Arr::except(CreateAeeRecordData::rules(), 'attendance_session_id'),
        ];
    }

    public static function messages(): array
    {
        return [
            ...self::attendanceDetailsMessages(),
            'type.required' => 'O formato do atendimento é obrigatório.',
            'type.enum' => 'O formato do atendimento informado é inválido.',
            ...Arr::except(CreateAeeRecordData::messages(), ['attendance_session_id.required', 'attendance_session_id.exists']),
        ];
    }

    /** Registro já validado, vinculado ao agendamento criado para ele. */
    public function recordFor(int $attendanceSessionId): CreateAeeRecordData
    {
        return new CreateAeeRecordData(
            attendanceSessionId: $attendanceSessionId,
            duration: $this->duration,
            activitiesPerformed: $this->activitiesPerformed,
            strategiesUsed: $this->strategiesUsed,
            resourcesUsed: $this->resourcesUsed,
            generalObservations: $this->generalObservations,
            evaluations: $this->evaluations,
        );
    }
}
