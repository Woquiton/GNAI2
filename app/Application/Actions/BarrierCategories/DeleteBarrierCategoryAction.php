<?php

declare(strict_types=1);

namespace App\Application\Actions\BarrierCategories;

use App\Application\Queries\BarrierCategories\BarrierCategoryHasBlockingBarriersQuery;
use App\Domain\Exceptions\InvalidBarrierCategory;
use App\Domain\Models\BarrierCategory;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteBarrierCategoryAction
{
    public function __construct(
        private BarrierCategoryHasBlockingBarriersQuery $hasBlockingBarriers,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(BarrierCategory $category): void
    {
        DB::transaction(function () use ($category): void {
            $lockedCategory = BarrierCategory::query()
                ->lockForUpdate()
                ->findOrFail($category->getKey());

            if ($this->hasBlockingBarriers->execute($lockedCategory)) {
                throw new InvalidBarrierCategory(
                    'Esta categoria não pode ser excluída pois possui barreiras ativas.'
                );
            }

            $lockedCategory->delete();
        });
    }
}
