<?php

declare(strict_types=1);

namespace App\Domains\Auth\Domain\DTOs\Sessions;

final readonly class SessionSecurityStateDTO
{
    public function __construct(
        public int $lastActivity,
        public bool $locked = false,
        public bool $expired = false,
        public ?string $returnTo = null,
    ) {}
}
