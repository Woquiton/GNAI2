<?php

declare(strict_types=1);

namespace App\Domains\Domain\Exceptions\Auth;

use App\Shared\Application\Exceptions\AccessDeniedException;

final class UserWithoutAccess extends AccessDeniedException
{
    public static function make(): self
    {
        return new self('Usuário sem permissão de acesso.');
    }
}
