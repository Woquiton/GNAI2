<?php

declare(strict_types=1);

namespace Tests\Unit\Application\Data\Publications;

use App\Application\Data\Publications\ListPublicationsData;
use Tests\TestCase;

final class ListPublicationsDataTest extends TestCase
{
    public function test_it_maps_snake_case_filters(): void
    {
        $data = ListPublicationsData::from([
            'title' => 'Semana',
            'is_active' => true,
            'per_page' => 20,
        ]);

        self::assertSame('Semana', $data->title);
        self::assertTrue($data->isActive);
        self::assertSame(20, $data->perPage);
    }
}
