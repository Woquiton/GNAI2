<?php

declare(strict_types=1);

namespace App\Application\Actions\BarrierCategories;

use App\Application\Data\BarrierCategories\CreateBarrierCategoryData;
use App\Domain\DTOs\BarrierCategories\CreateBarrierCategoryDTO;
use App\Domain\Exceptions\InvalidBarrierCategory;
use App\Domain\Models\BarrierCategory;

final readonly class CreateBarrierCategoryAction
{
    /**
     * @throws InvalidBarrierCategory
     */
    public function execute(CreateBarrierCategoryData $data): BarrierCategory
    {
        $categoryDTO = new CreateBarrierCategoryDTO(
            name: $data->name,
            description: $data->description,
            blocksMap: $data->blocksMap,
            isActive: $data->isActive,
        );

        $category = BarrierCategory::register($categoryDTO);
        $category->save();

        return $category;
    }
}
