<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Students;

use App\Domains\Domain\Enums\Students\StudentFollowUpType;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\ValueObjects\Students\Registration;

final readonly class CreateStudentDTO
{
    public function __construct(
        public Registration $registration,
        public ?StudentFollowUpType $followUpType,
        public ?string $entryDate = null,
        public StudentStatus $status = StudentStatus::ACTIVE,
    ) {}
}
