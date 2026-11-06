<?php

declare(strict_types=1);

namespace App\Application\Queries\BarrierCategories;

use App\Domain\Models\BarrierCategory;

final class ShowBarrierCategoryQuery
{
    public function execute(BarrierCategory $category): BarrierCategory
    {
        return $category->loadCount('barriers');
    }
}
