<?php

declare(strict_types=1);

namespace Tests\Feature\AccessibilityFeatures;

use App\Application\Actions\AccessibilityFeatures\DeleteAccessibilityFeatureAction;
use App\Domain\Models\AccessibilityFeature;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class DeleteAccessibilityFeatureActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_deletes_an_accessibility_feature(): void
    {
        $feature = AccessibilityFeature::factory()->create();

        app(DeleteAccessibilityFeatureAction::class)->execute($feature);

        $this->assertDatabaseMissing('accessibility_features', [
            'id' => $feature->id,
        ]);
    }
}
