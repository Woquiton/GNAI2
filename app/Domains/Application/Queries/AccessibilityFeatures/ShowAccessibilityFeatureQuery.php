<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\AccessibilityFeatures;

use App\Domains\Domain\Models\AccessibilityFeatures\AccessibilityFeature;

final class ShowAccessibilityFeatureQuery
{
    public function execute(AccessibilityFeature $feature): AccessibilityFeature
    {
        return $feature->loadCount('items');
    }
}
