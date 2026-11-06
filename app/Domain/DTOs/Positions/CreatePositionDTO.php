<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Positions;

final readonly class CreatePositionDTO
{
    public function __construct(
        public string $name,
        public ?string $description = null,
        public bool $isActive = true,
    ) {}
}
