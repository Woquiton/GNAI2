<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Auth\Sessions;

final readonly class LogoutSessionDTO
{
    public function __construct(
        public bool $clearImpersonation = true,
    ) {}
}
