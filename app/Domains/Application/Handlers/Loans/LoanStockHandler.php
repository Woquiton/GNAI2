<?php

declare(strict_types=1);

namespace App\Domains\Application\Handlers\Loans;

use App\Domains\Domain\Enums\Items\ResourceStatus;
use App\Domains\Domain\Exceptions\Items\InsufficientStock;
use App\Domains\Domain\Exceptions\Items\StockAlreadyFull;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Domain\Enums\Loans\LoanStatus;

final class LoanStockHandler
{
    /**
     * @throws InsufficientStock
     */
    public function withdraw(Item $item): void
    {
        if ($item->is_digital) {
            return;
        }

        $stock = $item->stock()->withdrawOne();

        $item->update([
            'quantity_available' => $stock->available(),
            'status' => $stock->isEmpty()
                ? ResourceStatus::IN_USE
                : $item->status,
        ]);
    }

    /**
     * @throws StockAlreadyFull
     */
    public function returnAvailable(Item $item): void
    {
        $this->returnWithStatus($item, ResourceStatus::AVAILABLE);
    }

    /**
     * @throws StockAlreadyFull
     */
    public function returnFromLoanStatus(
        Item $item,
        LoanStatus $status,
    ): void {
        $this->returnWithStatus(
            item: $item,
            status: $status === LoanStatus::DAMAGED
                ? ResourceStatus::DAMAGED
                : ResourceStatus::AVAILABLE,
        );
    }

    /**
     * @throws StockAlreadyFull
     */
    private function returnWithStatus(
        Item $item,
        ResourceStatus $status,
    ): void {
        if ($item->is_digital) {
            return;
        }

        $stock = $item->stock()->returnOne();

        $item->update([
            'quantity_available' => $stock->available(),
            'status' => $status,
        ]);
    }
}
