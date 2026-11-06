<?php

declare(strict_types=1);

namespace App\Application\Actions\AccessibilityFeatures;

use App\Application\Data\AccessibilityFeatures\UpdateAccessibilityFeatureData;
use App\Domain\DTOs\AccessibilityFeatures\UpdateAccessibilityFeatureDTO;
use App\Domain\Exceptions\InvalidAccessibilityFeature;
use App\Domain\Models\AccessibilityFeature;

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
