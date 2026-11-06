<?php

declare(strict_types=1);

namespace App\Application\Actions\Locations;

use App\Application\Data\Locations\UpdateLocationData;
use App\Application\Queries\Locations\LocationHasUnresolvedBarriersQuery;
use App\Domain\DTOs\Locations\UpdateLocationDTO;
use App\Domain\Exceptions\InvalidLocation;
use App\Domain\Models\Location;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdateLocationAction
{
    public function __construct(
        private LocationHasUnresolvedBarriersQuery $hasUnresolvedBarriers,
    ) {}

    /**
     * @throws InvalidLocation
     * @throws Throwable
     */
    public function execute(Location $location, UpdateLocationData $data): Location
    {
        return DB::transaction(function () use ($location, $data): Location {
            $lockedLocation = Location::query()
                ->lockForUpdate()
                ->findOrFail($location->getKey());

            $willDeactivate = $lockedLocation->is_active && ! $data->isActive;

            if ($willDeactivate && $this->hasUnresolvedBarriers->execute($lockedLocation)) {
                throw new InvalidLocation(
                    'Existem barreiras não resolvidas vinculadas a este local. Resolva-as antes de desativá-lo.'
                );
            }

            $locationDTO = new UpdateLocationDTO(
                institutionId: $data->institutionId,
                name: $data->name,
                latitude: $data->latitude,
                longitude: $data->longitude,
                type: $data->type,
                description: $data->description,
                googlePlaceId: $data->googlePlaceId,
                isActive: $data->isActive,
            );

            $lockedLocation->revise($locationDTO);
            $lockedLocation->save();

            return $lockedLocation;
        });
    }
}
