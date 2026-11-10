<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\AccessibilityFeatures;

use App\Domains\Application\Data\AccessibilityFeatures\ListAccessibilityFeaturesData;
use App\Domains\Domain\Models\AccessibilityFeatures\AccessibilityFeature;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListAccessibilityFeaturesQuery
{
    /**
     * @return LengthAwarePaginator<int, AccessibilityFeature>
     */
    public function execute(ListAccessibilityFeaturesData $filters): LengthAwarePaginator
    {
        $query = AccessibilityFeature::query()
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ));

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
