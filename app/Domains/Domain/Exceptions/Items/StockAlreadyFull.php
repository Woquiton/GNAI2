<?php

declare(strict_types=1);

namespace App\Domains\Domain\Exceptions\Items;

use App\Shared\Domain\Exceptions\ResourceException;

final class StockAlreadyFull extends ResourceException
{
    public function __construct()
    {
        parent::__construct(
            'Não é possível devolver uma unidade: o estoque já está completo.'
        );
    }
}
