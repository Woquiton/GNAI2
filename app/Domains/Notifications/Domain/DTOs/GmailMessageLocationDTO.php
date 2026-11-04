<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Domain\DTOs;

final readonly class GmailMessageLocationDTO
{
    /** @param list<string> $labels */
    public function __construct(
        public string $messageId,
        public string $mailbox,
        public int $uid,
        public array $labels,
        public ?string $folder,
    ) {}
}
