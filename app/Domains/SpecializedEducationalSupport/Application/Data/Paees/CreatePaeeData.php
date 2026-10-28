<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Data\Paees;

use App\Domains\SpecializedEducationalSupport\Application\Data\Paees\Concerns\HasPaeeValidation;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class CreatePaeeData extends Data
{
    use HasPaeeValidation;

    public function __construct(
        public int $caseStudyId,
        public int $attendanceFrequencyPerWeek,
        public int $attendanceDurationMinutes,
        public string $attendanceFormat,
        public string $attendanceLocation,
        public bool $assistiveTechnologyNeeded,
        public ?string $assistiveTechnologyNotes,
        public ?string $assistiveTechnologyAvailabilityCapacity,
        public bool $caaNeeded,
        public ?string $caaNotes,
        public bool $isAssistiveTechnologyPortableDigitalDevice,
        public ?string $assistiveTechnologyPedagogicalOpinion,
        public bool $supportProfessionalNeeded,
        public ?string $supportProfessionalJustification,
        public bool $librasInterpreterNeeded,
        public ?string $librasInterpreterJustification,
        public bool $guideInterpreterNeeded,
        public ?string $guideInterpreterJustification,
        public ?string $schoolProfessionalsOrientation,
        public ?string $commonTeachersArticulation,
        public ?string $familyArticulation,
        public ?string $intersectoralArticulation,
        public ?string $trainingDemands,
        public array $objectives = [],
        public array $resources = [],
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        return self::preparePresence($properties);
    }

    public static function rules(): array
    {
        return [
            'case_study_id' => ['required', 'integer', 'exists:case_studies,id'],
            ...self::contentRules(),
        ];
    }
}
