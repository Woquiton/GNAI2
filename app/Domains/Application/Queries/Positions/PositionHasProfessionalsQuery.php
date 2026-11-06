<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Positions;

use App\Domains\Domain\Models\Positions\Position;

final class PositionHasProfessionalsQuery
{
    public function execute(Position $position): bool
    {
        return $position->professionals()->exists();
    }
}
