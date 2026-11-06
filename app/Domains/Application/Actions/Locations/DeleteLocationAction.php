<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Locations;

use App\Domains\Application\Queries\Locations\LocationHasUnresolvedBarriersQuery;
use App\Domains\Domain\Exceptions\Locations\InvalidLocation;
use App\Domains\Domain\Models\Locations\Location;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteLocationAction
{
    public function __construct(
        private LocationHasUnresolvedBarriersQuery $hasUnresolvedBarriers,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Location $location): void
    {
        DB::transaction(function () use ($location): void {
            $lockedLocation = Location::query()
                ->lockForUpdate()
                ->findOrFail($location->getKey());

            if ($this->hasUnresolvedBarriers->execute($lockedLocation)) {
                throw new InvalidLocation(
                    'Não é possível excluir este ponto de referência pois ele possui barreiras ativas.'
                );
            }

            $lockedLocation->delete();
        });
    }
}
