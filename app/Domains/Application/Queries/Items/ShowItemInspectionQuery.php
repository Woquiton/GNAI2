<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Items;

use App\Domains\Domain\Models\Inspections\Inspection;
use App\Domains\Domain\Models\Items\Item;
use Illuminate\Auth\Access\AuthorizationException;

final class ShowItemInspectionQuery
{
    /**
     * @throws AuthorizationException
     */
    public function execute(
        Item $item,
        Inspection $inspection,
    ): Inspection {
        $item->loadMissing('coverEvidence');
        $scopedInspection = $item->inspections()
            ->with('evidences')
            ->whereKey($inspection->getKey())
            ->first();

        if ($scopedInspection === null) {
            throw new AuthorizationException(
                'A inspeção não pertence ao item informado.'
            );
        }

        return $scopedInspection;
    }
}
