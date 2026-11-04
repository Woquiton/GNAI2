<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Domain\DTOs;

/** Contrato interno comum: cada módulo fornece o destinatário, conteúdo e vínculo de origem. */
final readonly class EmailMessageDTO
{
    /** @param array<string, mixed> $payload */
    public function __construct(
        public string $contextType,
        public int $contextId,
        public string $purpose,
        public string $deduplicationKey,
        public ?string $recipientEmail,
        public ?string $recipientName,
        public string $subject,
        public string $view,
        public ?string $textView,
        public array $payload,
    ) {}
}
