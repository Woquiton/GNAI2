<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Notifications;

final readonly class EmailBounceDTO
{
    public function __construct(
        public string $messageId,
        public string $recipient,
        public string $status,
    ) {}
}
