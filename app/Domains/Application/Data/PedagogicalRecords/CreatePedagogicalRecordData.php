<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\PedagogicalRecords;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class CreatePedagogicalRecordData extends Data
{
    public function __construct(
        public int $attendanceSessionId,
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
        $properties['is_present'] = filter_var($properties['is_present'] ?? false, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        $properties['with_guardians'] = filter_var($properties['with_guardians'] ?? false, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

        return $properties;
    }

    public static function rules(): array
    {
        return [
            'attendance_session_id' => ['required', 'integer', 'exists:attendance_sessions,id'],
            'follow_up_reason' => ['required', 'string', 'max:100000'],
            'duration' => ['required', 'string', 'max:50'],
            'is_present' => ['required', 'boolean'],
            'with_guardians' => ['required', 'boolean'],
            'guardian_ids' => ['exclude_unless:with_guardians,1,true', 'required', 'array', 'min:1'],
            'guardian_ids.*' => ['integer', 'distinct', 'exists:student_guardians,id'],
            'absence_reason' => ['required_if:is_present,0', 'nullable', 'string', 'max:100000'],
            'systematic_pedagogical_follow_up_record' => ['required_if:is_present,1', 'required_if:with_guardians,1', 'nullable', 'string', 'max:100000'],
            'strategies_and_resources_adopted' => ['nullable', 'string', 'max:100000'],
            'referrals_made' => ['nullable', 'string', 'max:100000'],
            'complementary_observations' => ['nullable', 'string', 'max:100000'],
        ];
    }

    public static function messages(): array
    {
        return [
            'guardian_ids.required' => 'Selecione ao menos um responsável participante.',
            'guardian_ids.min' => 'Selecione ao menos um responsável participante.',
        ];
    }
}
