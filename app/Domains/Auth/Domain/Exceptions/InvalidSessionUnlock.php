<?php

declare(strict_types=1);

namespace App\Domains\Auth\Domain\Exceptions;

use App\Shared\Domain\Exceptions\BusinessRuleException;

final class InvalidSessionUnlock extends BusinessRuleException
{
    public static function incorrectPassword(): self
    {
        return new self('Senha incorreta. Tente novamente.');
    }

    public static function tooManyAttempts(): self
    {
        return new self('Muitas tentativas. Aguarde um minuto antes de tentar novamente.');
    }
}
