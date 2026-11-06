<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

final class InvalidBarrier extends ResourceException
{
    public function __construct(string $message = 'A barreira informada é inválida.')
    {
        parent::__construct($message);
    }
}
