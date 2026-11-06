<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\StudentDeficiencies;

use App\Domains\Domain\Enums\StudentDeficiencies\DeficiencySeverity;

final readonly class CreateStudentDeficiencyDTO
{
    public function __construct(
        public ?DeficiencySeverity $severity = null,
        public ?string $notes = null,
    ) {}
}
