<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Waitlists;

use App\Domains\Domain\Enums\Waitlists\WaitlistStatus;

final readonly class UpdateWaitlistDTO
{
    public function __construct(
        public ?WaitlistStatus $status,
        public ?string $observation,
    ) {}
}
