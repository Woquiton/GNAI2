<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Locations;

use App\Domains\Domain\Models\Locations\Location;

final class ShowLocationQuery
{
    public function execute(Location $location): Location
    {
        return $location->load('institution');
    }
}
