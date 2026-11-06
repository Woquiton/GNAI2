<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\BarrierCategories;

use App\Domains\Application\Data\BarrierCategories\CreateBarrierCategoryData;
use App\Domains\Domain\DTOs\BarrierCategories\CreateBarrierCategoryDTO;
use App\Domains\Domain\Exceptions\BarrierCategories\InvalidBarrierCategory;
use App\Domains\Domain\Models\BarrierCategories\BarrierCategory;

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
