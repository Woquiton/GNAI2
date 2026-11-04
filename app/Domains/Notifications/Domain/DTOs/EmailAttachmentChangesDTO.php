<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Domain\DTOs;

final readonly class EmailAttachmentChangesDTO
{
    public function __construct(
        public array $attachments,
        public array $created,
        public array $removed,
    ) {}
}
