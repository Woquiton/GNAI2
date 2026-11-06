<?php

declare(strict_types=1);

namespace App\Application\Data\PedagogicalRecords;

use App\Application\Data\Sessions\Concerns\ValidatesAttendanceDetails;
use Illuminate\Support\Arr;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Registro de um atendimento pedagógico já realizado sem agendamento prévio: data, horário, local
 * e aluno chegam junto do registro. O motivo do acompanhamento também é o objetivo do agendamento,
 * como no fluxo agendado, em que o objetivo preenche o motivo.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class CreateDirectPedagogicalRecordData extends Data
{
    use ValidatesAttendanceDetails;

    /**
     * @param  list<int>  $studentIds
     */
    public function __construct(
        public array $studentIds,
        public string $sessionDate,
        public string $startTime,
        public ?string $endTime,
        public string $location,
        public string $followUpReason,
        public string $duration,
        public bool $isPresent,
        public ?string $absenceReason = null,
        public ?string $systematicPedagogicalFollowUpRecord = null,
        public ?string $strategiesAndResourcesAdopted = null,
        public ?string $referralsMade = null,
        public ?string $complementaryObservations = null,
        public bool $withGuardians = false,
        public array $guardianIds = [],
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        return CreatePedagogicalRecordData::prepareForPipeline($properties);
    }

    public static function rules(): array
    {
        return [
            ...self::attendanceStudentsRules(),
            ...self::attendanceDetailsRules(),
            ...Arr::except(CreatePedagogicalRecordData::rules(), 'attendance_session_id'),
        ];
    }

    public static function messages(): array
    {
        return [
            ...self::attendanceDetailsMessages(),
            ...CreatePedagogicalRecordData::messages(),
        ];
    }

    /** Registro já validado, vinculado ao agendamento criado para ele. */
    public function recordFor(int $attendanceSessionId): CreatePedagogicalRecordData
    {
        return new CreatePedagogicalRecordData(
            attendanceSessionId: $attendanceSessionId,
            followUpReason: $this->followUpReason,
            duration: $this->duration,
            isPresent: $this->isPresent,
            absenceReason: $this->absenceReason,
            systematicPedagogicalFollowUpRecord: $this->systematicPedagogicalFollowUpRecord,
            strategiesAndResourcesAdopted: $this->strategiesAndResourcesAdopted,
            referralsMade: $this->referralsMade,
            complementaryObservations: $this->complementaryObservations,
            withGuardians: $this->withGuardians,
            guardianIds: $this->guardianIds,
        );
    }
}
