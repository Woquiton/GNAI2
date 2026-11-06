<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\Items;

use App\Domains\Application\Queries\Items\ItemAssetCodeExistsQuery;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Domain\ValueObjects\Items\AssetCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ItemAssetCodeExistsQueryTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_detects_an_asset_code_used_by_another_item(): void
    {
        $item = Item::factory()->physical()->create(['asset_code' => 'TA-1001']);
        $query = app(ItemAssetCodeExistsQuery::class);

        self::assertTrue($query->execute(AssetCode::from('TA-1001')));
        self::assertFalse($query->execute(AssetCode::from('TA-1001'), ignoreId: $item->id));
        self::assertFalse($query->execute(AssetCode::from('TA-9999')));
    }
}
