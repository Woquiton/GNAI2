<?php

declare(strict_types=1);

namespace App\Application\Queries\AccessibilityFeatures;

use App\Application\Data\AccessibilityFeatures\ListAccessibilityFeaturesData;
use App\Domain\Models\AccessibilityFeature;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListAccessibilityFeaturesQuery
{
    /**
     * @return LengthAwarePaginator<int, AccessibilityFeature>
     */
    public function execute(ListAccessibilityFeaturesData $filters): LengthAwarePaginator
    {
        $query = AccessibilityFeature::query();

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
