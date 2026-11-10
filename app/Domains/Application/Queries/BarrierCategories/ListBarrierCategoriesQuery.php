<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\BarrierCategories;

use App\Domains\Application\Data\BarrierCategories\ListBarrierCategoriesData;
use App\Domains\Domain\Models\BarrierCategories\BarrierCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListBarrierCategoriesQuery
{
    /**
     * @return LengthAwarePaginator<int, BarrierCategory>
     */
    public function execute(ListBarrierCategoriesData $filters): LengthAwarePaginator
    {
        $query = BarrierCategory::query()
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ))
            ->withCount('barriers');

        if (filled($filters->name)) {
            $query->where('name', 'like', '%'.trim($filters->name).'%');
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
