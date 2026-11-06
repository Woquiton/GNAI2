<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\AccessibilityFeatures;

use App\Domains\Application\Data\AccessibilityFeatures\CreateAccessibilityFeatureData;
use App\Domains\Domain\DTOs\AccessibilityFeatures\CreateAccessibilityFeatureDTO;
use App\Domains\Domain\Exceptions\AccessibilityFeatures\InvalidAccessibilityFeature;
use App\Domains\Domain\Models\AccessibilityFeatures\AccessibilityFeature;

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
