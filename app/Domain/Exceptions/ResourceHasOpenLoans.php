<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

final class ResourceHasOpenLoans extends ResourceException
{
    public function __construct()
    {
        parent::__construct(
            'Não é possível excluir um item com empréstimos ativos.'
        );
    }
}
