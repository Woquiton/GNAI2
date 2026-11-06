<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Waitlists;

use App\Domain\Enums\WaitlistStatus;

final readonly class UpdateWaitlistDTO
{
    public function __construct(
        public ?WaitlistStatus $status,
        public ?string $observation,
    ) {}
}
