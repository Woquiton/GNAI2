<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Students;

use App\Domain\Enums\StudentFollowUpType;
use App\Domain\Enums\StudentStatus;
use App\Domain\ValueObjects\Registration;

final readonly class UpdateStudentDTO
{
    public function __construct(
        public Registration $registration,
        public StudentStatus $status,
        public ?StudentFollowUpType $followUpType,
        public ?string $entryDate = null,
    ) {}
}
