<?php

declare(strict_types=1);

namespace App\Application\Queries\Locations;

use App\Domain\Models\Location;

final class ShowLocationQuery
{
    public function execute(Location $location): Location
    {
        return $location->load('institution');
    }
}
