<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Domain\DTOs\CaseStudies;

final readonly class CaseStudyDTO
{
    public function __construct(
        public string $demandOrigin,
        public ?string $participantsSummary,
        public ?string $studyDate,
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
    ) {}
}
