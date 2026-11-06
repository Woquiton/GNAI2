<?php

declare(strict_types=1);

namespace App\Application\Queries\AccessibilityFeatures;

use App\Domain\Models\AccessibilityFeature;

final class ShowAccessibilityFeatureQuery
{
    public function execute(AccessibilityFeature $feature): AccessibilityFeature
    {
        return $feature->loadCount('items');
    }
}
