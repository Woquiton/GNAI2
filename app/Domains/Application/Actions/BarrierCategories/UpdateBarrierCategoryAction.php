<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\BarrierCategories;

use App\Domains\Application\Data\BarrierCategories\UpdateBarrierCategoryData;
use App\Domains\Domain\DTOs\BarrierCategories\UpdateBarrierCategoryDTO;
use App\Domains\Domain\Exceptions\BarrierCategories\InvalidBarrierCategory;
use App\Domains\Domain\Models\BarrierCategories\BarrierCategory;

final readonly class UpdateBarrierCategoryAction
{
    /**
     * @throws InvalidBarrierCategory
     */
    public function execute(BarrierCategory $category, UpdateBarrierCategoryData $data): BarrierCategory
    {
        $categoryDTO = new UpdateBarrierCategoryDTO(
            name: $data->name,
            description: $data->description,
            blocksMap: $data->blocksMap,
            isActive: $data->isActive,
        );

        $category->revise($categoryDTO);
        $category->save();

        return $category;
    }
}
