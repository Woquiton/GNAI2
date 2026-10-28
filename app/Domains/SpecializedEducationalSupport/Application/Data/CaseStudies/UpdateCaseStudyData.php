<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Data\CaseStudies;

use App\Domains\SpecializedEducationalSupport\Application\Data\CaseStudies\Concerns\HasCaseStudyValidation;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class UpdateCaseStudyData extends Data
{
    use HasCaseStudyValidation;

    public function __construct(
        public ?string $participantsSummary,
        public ?string $studyDate,
        public string $demandOrigin,
        public string $studentObservation,
        public string $studentFamilyListening,
        public string $teachersListening,
        public ?string $otherInfo,
        public ?string $careNetworkNotes,
        public string $favorableAspects,
        public string $potentialsInterests,
        public array $neededSupports,
        public ?string $neededSupportsJustification,
        public string $acceptanceStatus,
        public ?string $acceptanceDate,
        public array $barriers = [],
        public array $strategies = [],
    ) {}

    public static function rules(): array
    {
        return self::contentRules();
    }
}
