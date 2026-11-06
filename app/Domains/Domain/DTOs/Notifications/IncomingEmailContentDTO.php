<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Notifications;

final readonly class IncomingEmailContentDTO
{
    public function __construct(public string $html, public array $attachments, public array $notices) {}
}
