<?php

declare(strict_types=1);

namespace App\Application\Actions\AccessibilityFeatures;

use App\Application\Data\AccessibilityFeatures\CreateAccessibilityFeatureData;
use App\Domain\DTOs\AccessibilityFeatures\CreateAccessibilityFeatureDTO;
use App\Domain\Exceptions\InvalidAccessibilityFeature;
use App\Domain\Models\AccessibilityFeature;

final readonly class CreateAccessibilityFeatureAction
{
    /**
     * @throws InvalidAccessibilityFeature
     */
    public function execute(CreateAccessibilityFeatureData $data): AccessibilityFeature
    {
        $featureDTO = new CreateAccessibilityFeatureDTO(
            name: $data->name,
            description: $data->description,
            isActive: $data->isActive,
        );

        $feature = AccessibilityFeature::register($featureDTO);
        $feature->save();

        return $feature;
    }
}
