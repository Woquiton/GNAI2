<?php

declare(strict_types=1);

namespace App\Domains\Domain\Exceptions\Items;

use App\Shared\Domain\Exceptions\ResourceException;

final class InsufficientStock extends ResourceException
{
    public function __construct()
    {
        parent::__construct(
            'Não há unidades disponíveis em estoque.'
        );
    }
}
