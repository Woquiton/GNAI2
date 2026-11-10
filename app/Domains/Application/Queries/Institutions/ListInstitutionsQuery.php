<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Institutions;

use App\Domains\Application\Data\Institutions\ListInstitutionsData;
use App\Domains\Domain\Models\Institutions\Institution;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListInstitutionsQuery
{
    /**
     * @return LengthAwarePaginator<int, Institution>
     */
    public function execute(ListInstitutionsData $filters): LengthAwarePaginator
    {
        $query = Institution::query()
            ->when(filled($filters->shortName), fn ($query) => $query->where(
                'short_name', 'like', '%'.trim($filters->shortName).'%',
            ))
            ->when(filled($filters->district), fn ($query) => $query->where(
                'district', 'like', '%'.trim($filters->district).'%',
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
            ->with(['locations', 'barriers']);

        if (filled($filters->name)) {
            $query->where('name', 'like', '%'.trim($filters->name).'%');
        }

        if (filled($filters->location)) {
            $location = trim($filters->location);

            $query->where(function ($query) use ($location): void {
                $query
                    ->where('city', 'like', "%{$location}%")
                    ->orWhere('state', 'like', "%{$location}%");
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
