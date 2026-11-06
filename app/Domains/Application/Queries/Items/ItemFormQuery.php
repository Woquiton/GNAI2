<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Items;

use App\Domains\Domain\Models\AccessibilityFeatures\AccessibilityFeature;
use App\Domains\Domain\Models\Deficiencies\Deficiency;
use App\Domains\Domain\Enums\Inspections\InspectionType;
use App\Domains\Domain\Enums\Items\ConservationState;
use App\Domains\Domain\Enums\Items\ItemType;
use App\Domains\Domain\Enums\Items\ResourceStatus;
use App\Domains\Domain\Models\Items\Item;

final class ItemFormQuery
{
    /**
     * @return array<string, mixed>
     */
    public function forCreation(): array
    {
        return $this->formOptions(InspectionType::INITIAL) + [
            'defaultStatus' => ResourceStatus::AVAILABLE->value,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function forCloning(Item $item): array
    {
        $item->loadMissing(['deficiencies', 'accessibilityFeatures']);

        return $this->forCreation() + [
            'cloneSource' => $item,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function forUpdate(Item $item): array
    {
        $item->loadMissing(['deficiencies', 'accessibilityFeatures']);

        return $this->formOptions(InspectionType::PERIODIC) + [
            'item' => $item,
            'activeLoans' => $item->loans()
                ->whereNull('return_date')
                ->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(InspectionType $defaultInspection): array
    {
        return [
            'itemTypes' => ItemType::options(),
            'deficiencies' => Deficiency::query()->orderBy('name')->get(),
            'accessibilityFeatures' => AccessibilityFeature::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
            'resourceStatuses' => collect(ResourceStatus::cases())
                ->mapWithKeys(
                    static fn (ResourceStatus $status): array => [
                        $status->value => $status->label(),
                    ],
                ),
            'conservationStates' => collect(ConservationState::cases())
                ->mapWithKeys(
                    static fn (ConservationState $state): array => [
                        $state->value => $state->label(),
                    ],
                ),
            'inspectionTypes' => collect(InspectionType::cases())
                ->mapWithKeys(
                    static fn (InspectionType $type): array => [
                        $type->value => $type->label(),
                    ],
                ),
            'defaultInspection' => $defaultInspection->value,
        ];
    }
}
