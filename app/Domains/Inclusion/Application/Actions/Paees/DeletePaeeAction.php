<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Actions\Paees;

use App\Domains\Inclusion\Domain\Exceptions\InvalidPaee;
use App\Domains\Inclusion\Domain\Models\Paee;
use App\Domains\Inclusion\Domain\Models\Pei;
use Illuminate\Support\Facades\DB;
use Throwable;

final class DeletePaeeAction
{
    /**
     * @throws InvalidPaee
     * @throws Throwable
     */
    public function execute(Paee $paee): void
    {
        DB::transaction(function () use ($paee): void {
            $lockedPaee = Paee::query()->lockForUpdate()->findOrFail($paee->getKey());

            if (Pei::query()->where('paee_id', $lockedPaee->getKey())->exists()) {
                throw new InvalidPaee('Não é possível excluir um PAEE que já possui PEI vinculado.');
            }

            // Um a um, para a auditoria registrar cada exclusão.
            $lockedPaee->objectives()->get()->each->delete();
            $lockedPaee->resources()->get()->each->delete();
            $lockedPaee->reviews()->get()->each->delete();
            $lockedPaee->delete();
        });
    }
}
