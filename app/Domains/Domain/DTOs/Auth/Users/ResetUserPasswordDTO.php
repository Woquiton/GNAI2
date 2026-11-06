<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Auth\Users;

final readonly class ResetUserPasswordDTO
{
    public function __construct(
        public string $password,
        public string $rememberToken,
    ) {}
}
