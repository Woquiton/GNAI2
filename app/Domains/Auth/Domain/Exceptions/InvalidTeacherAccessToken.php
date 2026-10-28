<?php

declare(strict_types=1);

namespace App\Domains\Auth\Domain\Exceptions;

use App\Shared\Domain\Exceptions\BusinessRuleException;

final class InvalidTeacherAccessToken extends BusinessRuleException
{
    public static function make(): self
    {
        return new self('Este link de acesso é inválido, já foi usado ou expirou.');
    }
}
