<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Locations;

use App\Domains\Application\Data\Locations\ListLocationsData;
use App\Domains\Domain\Models\Locations\Location;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class ListLocationsQuery
{
    /**
     * @return LengthAwarePaginator<int, Location>
     */
    public function execute(ListLocationsData $filters): LengthAwarePaginator
    {
        $query = Location::query()
            ->when(filled($filters->type), fn ($query) => $query->where(
                'type', 'like', '%'.trim($filters->type).'%',
            ))
            ->when($filters->hasBarriers !== null, fn ($query) => $filters->hasBarriers
                ? $query->has('barriers')
                : $query->doesntHave('barriers'))
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ))
            ->with('institution');

        if (filled($filters->name)) {
            $query->where('name', 'like', '%'.trim($filters->name).'%');
        }

        if (filled($filters->institutionName)) {
            $query->whereHas('institution', function (Builder $query) use ($filters): void {
                $query->where('name', 'like', '%'.trim($filters->institutionName).'%');
            });
        }

        if ($filters->isActive !== null) {
            $query->where('is_active', $filters->isActive);
        }

        return $query
            ->orderBy('name')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
