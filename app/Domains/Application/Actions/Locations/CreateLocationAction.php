<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Locations;

use App\Domains\Application\Data\Locations\CreateLocationData;
use App\Domains\Domain\DTOs\Locations\CreateLocationDTO;
use App\Domains\Domain\Exceptions\Locations\InvalidLocation;
use App\Domains\Domain\Models\Locations\Location;

final readonly class CreateLocationAction
{
    /**
     * @throws InvalidLocation
     */
    public function execute(CreateLocationData $data): Location
    {
        $locationDTO = new CreateLocationDTO(
            institutionId: $data->institutionId,
            name: $data->name,
            latitude: $data->latitude,
            longitude: $data->longitude,
            type: $data->type,
            description: $data->description,
            googlePlaceId: $data->googlePlaceId,
            isActive: $data->isActive,
        );

        $location = Location::register($locationDTO);
        $location->save();

        return $location;
    }
}
