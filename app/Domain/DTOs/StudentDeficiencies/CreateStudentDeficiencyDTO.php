<?php

declare(strict_types=1);

namespace App\Domain\DTOs\StudentDeficiencies;

use App\Domain\Enums\DeficiencySeverity;

final readonly class CreateStudentDeficiencyDTO
{
    public function __construct(
        public ?DeficiencySeverity $severity = null,
        public ?string $notes = null,
    ) {}
}
