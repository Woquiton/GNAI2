<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\BarrierCategories;

use App\Domains\Domain\Models\BarrierCategories\BarrierCategory;

final class ShowBarrierCategoryQuery
{
    public function execute(BarrierCategory $category): BarrierCategory
    {
        return $category->loadCount('barriers');
    }
}
