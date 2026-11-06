<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\Items;

use App\Domains\Domain\Enums\Inspections\InspectionType;
use App\Domains\Application\Queries\Items\ItemFormQuery;
use App\Domains\Domain\Enums\Items\ResourceStatus;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Domain\Models\Loans\Loan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ItemFormQueryTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_prepares_a_clone_as_a_new_registration_of_the_source_item(): void
    {
        $source = Item::factory()->withDeficiencies(2)->withAccessibilityFeatures()->create();

        $form = app(ItemFormQuery::class)->forCloning($source);

        self::assertSame($source->id, $form['cloneSource']->id);
        self::assertCount(2, $form['cloneSource']->deficiencies);
        self::assertCount(1, $form['cloneSource']->accessibilityFeatures);
        self::assertSame(InspectionType::INITIAL->value, $form['defaultInspection']);
        self::assertSame(ResourceStatus::AVAILABLE->value, $form['defaultStatus']);
        self::assertArrayNotHasKey('item', $form);
    }

    public function test_it_counts_only_open_loans_when_editing(): void
    {
        $item = Item::factory()->physical()->create(['quantity' => 5, 'quantity_available' => 3]);
        Loan::factory()->count(2)->forAssistiveTechnology($item)->create();
        Loan::factory()->forAssistiveTechnology($item)->returned()->create();

        $form = app(ItemFormQuery::class)->forUpdate($item);

        self::assertSame(2, $form['activeLoans']);
        self::assertSame(InspectionType::PERIODIC->value, $form['defaultInspection']);
    }
}
