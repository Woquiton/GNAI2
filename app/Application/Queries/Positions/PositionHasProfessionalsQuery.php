<?php

declare(strict_types=1);

namespace App\Application\Queries\Positions;

use App\Domain\Models\Position;

final class PositionHasProfessionalsQuery
{
    public function execute(Position $position): bool
    {
        return $position->professionals()->exists();
    }
}
