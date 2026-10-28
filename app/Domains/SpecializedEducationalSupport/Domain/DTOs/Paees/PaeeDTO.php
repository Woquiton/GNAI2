<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Domain\DTOs\Paees;

final readonly class PaeeDTO
{
    public function __construct(
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
    ) {}
}
