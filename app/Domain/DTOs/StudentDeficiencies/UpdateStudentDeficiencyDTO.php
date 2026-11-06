<?php

declare(strict_types=1);

namespace App\Domain\DTOs\StudentDeficiencies;

use App\Domain\Enums\DeficiencySeverity;

final readonly class UpdateStudentDeficiencyDTO
{
    public function __construct(
        public ?DeficiencySeverity $severity = null,
        public ?string $notes = null,
    ) {}
}
