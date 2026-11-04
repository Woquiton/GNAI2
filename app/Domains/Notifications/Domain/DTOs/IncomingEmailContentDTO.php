<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Domain\DTOs;

final readonly class IncomingEmailContentDTO
{
    public function __construct(public string $html, public array $attachments, public array $notices) {}
}
