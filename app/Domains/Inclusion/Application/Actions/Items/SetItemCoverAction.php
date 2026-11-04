<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Actions\Items;

use App\Domains\Inclusion\Application\Data\Items\SetItemCoverData;
use App\Domains\Inclusion\Domain\Models\InspectionEvidence;
use App\Domains\Inclusion\Domain\Models\Item;
use Illuminate\Support\Facades\DB;

final readonly class SetItemCoverAction
{
    public function execute(Item $item, InspectionEvidence $evidence, SetItemCoverData $data): void
    {
        DB::transaction(function () use ($item, $evidence, $data): void {
            $lockedItem = Item::query()
                ->lockForUpdate()
                ->findOrFail($item->getKey());
            $image = InspectionEvidence::query()
                ->with('inspection')
                ->lockForUpdate()
                ->findOrFail($evidence->getKey());

            $lockedItem->setCover($image, $data->expectedCoverEvidenceId);
            $lockedItem->save();
        });
    }
}
