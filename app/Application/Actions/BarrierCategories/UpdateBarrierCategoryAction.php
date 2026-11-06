<?php

declare(strict_types=1);

namespace App\Application\Actions\BarrierCategories;

use App\Application\Data\BarrierCategories\UpdateBarrierCategoryData;
use App\Domain\DTOs\BarrierCategories\UpdateBarrierCategoryDTO;
use App\Domain\Exceptions\InvalidBarrierCategory;
use App\Domain\Models\BarrierCategory;

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
