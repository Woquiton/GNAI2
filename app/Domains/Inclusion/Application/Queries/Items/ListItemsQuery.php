<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\Items;

use App\Domains\Inclusion\Application\Data\Items\ListItemsData;
use App\Domains\Inclusion\Domain\Models\Item;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class ListItemsQuery
{
    /**
     * @return LengthAwarePaginator<int, Item>
     */
    public function execute(ListItemsData $filters): LengthAwarePaginator
    {
        $imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        $query = Item::query()
            ->with([
                'deficiencies',
                'accessibilityFeatures',
                'coverEvidence:id,path,original_name',
                'inspections' => fn ($inspections) => $inspections
                    ->select(['id', 'inspectable_id', 'inspectable_type', 'inspection_date'])
                    ->whereHas('evidences', fn (Builder $evidences) => $evidences->whereIn('mime_type', $imageTypes))
                    ->latest('inspection_date')->orderByDesc('id')->limit(1)
                    ->with(['evidences' => fn ($evidences) => $evidences
                        ->select(['id', 'inspection_id', 'path'])
                        ->whereIn('mime_type', $imageTypes)->orderBy('id')->limit(1)]),
            ]);

        if (filled($filters->name)) {
            $query->where('name', 'like', '%'.trim($filters->name).'%');
        }

        if ($filters->itemType !== null) {
            $query->where('item_type', $filters->itemType->value);
        }

        if ($filters->status !== null) {
            $query->where('status', $filters->status->value);
        }

        if ($filters->isDigital !== null) {
            $query->where('is_digital', $filters->isDigital);
        }

        if ($filters->isActive !== null) {
            $query->where('is_active', $filters->isActive);
        }

        if ($filters->available === true) {
            $query->where('quantity_available', '>', 0);
        }

        if ($filters->available === false) {
            $query->where('quantity_available', '<=', 0);
        }

        if ($filters->accessibilityFeatureId !== null) {
            $query->whereHas(
                'accessibilityFeatures',
                static fn ($featureQuery) => $featureQuery->where(
                    'accessibility_features.id',
                    $filters->accessibilityFeatureId,
                ),
            );
        }

        return $query
            ->orderBy('name')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
