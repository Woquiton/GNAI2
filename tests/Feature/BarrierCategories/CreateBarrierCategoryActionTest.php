<?php

declare(strict_types=1);

namespace Tests\Feature\BarrierCategories;

use App\Application\Actions\BarrierCategories\CreateBarrierCategoryAction;
use App\Application\Data\BarrierCategories\CreateBarrierCategoryData;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CreateBarrierCategoryActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_barrier_category(): void
    {
        $category = app(CreateBarrierCategoryAction::class)->execute(
            new CreateBarrierCategoryData(
                name: 'Arquitetônica',
                description: 'Barreiras físicas.',
                blocksMap: false,
                isActive: true,
            ),
        );

        self::assertSame('Arquitetônica', $category->name);
        $this->assertDatabaseHas('barrier_categories', [
            'id' => $category->id,
            'name' => 'Arquitetônica',
            'description' => 'Barreiras físicas.',
            'blocks_map' => false,
            'is_active' => true,
        ]);
    }
}
