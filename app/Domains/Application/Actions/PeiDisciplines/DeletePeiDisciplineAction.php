<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\PeiDisciplines;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Exceptions\PeiDisciplines\InvalidPeiDiscipline;
use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use App\Domains\Domain\Exceptions\Peis\InvalidPei;
use App\Domains\Domain\Models\Peis\Pei;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeletePeiDisciplineAction
{
    /**
     * @throws InvalidPei
     * @throws InvalidPeiDiscipline
     * @throws ModelNotFoundException
     * @throws Throwable
     */
    public function execute(PeiDiscipline $peiDiscipline, User $user): void
    {
        DB::transaction(function () use ($peiDiscipline, $user): void {
            $lockedPei = Pei::query()
                ->lockForUpdate()
                ->findOrFail($peiDiscipline->pei_id);

            $lockedPeiDiscipline = PeiDiscipline::query()
                ->lockForUpdate()
                ->where('pei_id', $lockedPei->getKey())
                ->findOrFail($peiDiscipline->getKey());

            $lockedPeiDiscipline->ensureCanBeManagedBy((int) $user->getKey(), $user->isAdmin());

            if ($lockedPei->is_finished) {
                throw new InvalidPei('Este PEI já foi finalizado e não permite alterações.');
            }

            $lockedPeiDiscipline->delete();
        });
    }
}
