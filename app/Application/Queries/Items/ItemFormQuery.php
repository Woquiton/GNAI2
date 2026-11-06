<?php

declare(strict_types=1);

namespace App\Application\Queries\Items;

use App\Domain\Enums\ConservationState;
use App\Domain\Enums\InspectionType;
use App\Domain\Enums\ItemType;
use App\Domain\Enums\ResourceStatus;
use App\Domain\Models\AccessibilityFeature;
use App\Domain\Models\Deficiency;
use App\Domain\Models\Item;

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
