<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\BarrierCategories;

use App\Domains\Application\Queries\BarrierCategories\BarrierCategoryHasBlockingBarriersQuery;
use App\Domains\Domain\Exceptions\BarrierCategories\InvalidBarrierCategory;
use App\Domains\Domain\Models\BarrierCategories\BarrierCategory;
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
