<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\AccessibilityFeatures;

use App\Domains\Application\Data\AccessibilityFeatures\UpdateAccessibilityFeatureData;
use App\Domains\Domain\DTOs\AccessibilityFeatures\UpdateAccessibilityFeatureDTO;
use App\Domains\Domain\Exceptions\AccessibilityFeatures\InvalidAccessibilityFeature;
use App\Domains\Domain\Models\AccessibilityFeatures\AccessibilityFeature;

final readonly class UpdateAccessibilityFeatureAction
{
    /**
     * @throws InvalidAccessibilityFeature
     */
    public function execute(AccessibilityFeature $feature, UpdateAccessibilityFeatureData $data): AccessibilityFeature
    {
        $featureDTO = new UpdateAccessibilityFeatureDTO(
            name: $data->name,
            description: $data->description,
            isActive: $data->isActive,
        );

        $feature->revise($featureDTO);
        $feature->save();

        return $feature;
    }
}
