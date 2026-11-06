<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Notifications;

final readonly class MailboxUpdateResultDTO
{
    public function __construct(
        public int $gmail,
        public int $local,
        public int $failed,
        public ?string $error = null,
    ) {}

    public function completed(): int
    {
        return $this->gmail + $this->local;
    }
}
