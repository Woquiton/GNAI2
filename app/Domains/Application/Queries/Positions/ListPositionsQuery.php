<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Positions;

use App\Domains\Application\Data\Positions\ListPositionsData;
use App\Domains\Domain\Models\Positions\Position;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListPositionsQuery
{
    /**
     * @return LengthAwarePaginator<int, Position>
     */
    public function execute(ListPositionsData $filters): LengthAwarePaginator
    {
        $query = Position::query()
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ));

        if (filled($filters->name)) {
            $query->where('name', 'like', trim($filters->name).'%');
        }

        if (filled($filters->description)) {
            $query->where('description', 'like', '%'.trim($filters->description).'%');
        }

        if ($filters->isActive !== null) {
            $query->where('is_active', $filters->isActive);
        }

        return $query
            ->withCount('professionals')
            ->orderBy('name')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
