<?php

declare(strict_types=1);

namespace App\Application\Queries\Positions;

use App\Domain\Models\Position;

final class ShowPositionQuery
{
    public function execute(Position $position): Position
    {
        return $position->load([
            'permissions' => fn ($query) => $query->orderBy('name'),
        ]);
    }
}
