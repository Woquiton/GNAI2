<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Inspections;

use App\Domains\Domain\Enums\Inspections\InspectionType;

final readonly class CreateInspectionDTO
{
    public function __construct(
        public string $date,
        public InspectionType $type,
        public int $registeredBy,
        public ?string $description = null,
        public ?string $state = null,
        public ?string $status = null,
    ) {}
}
