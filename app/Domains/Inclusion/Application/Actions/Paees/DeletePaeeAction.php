<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Actions\Paees;

use App\Domains\Inclusion\Domain\Models\Paee;
use Illuminate\Support\Facades\DB;
use Throwable;

final class DeletePaeeAction
{
    /** @throws Throwable */
    public function execute(Paee $paee): void
    {
        DB::transaction(function () use ($paee): void {
            $lockedPaee = Paee::query()->lockForUpdate()->findOrFail($paee->getKey());
            $lockedPaee->objectives()->delete();
            $lockedPaee->resources()->delete();
            $lockedPaee->reviews()->delete();
            $lockedPaee->delete();
        });
    }
}
