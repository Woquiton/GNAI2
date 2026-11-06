<?php

declare(strict_types=1);

namespace App\Application\Actions\PeiDisciplines;

use App\Domains\Auth\Domain\Models\User;
use App\Domain\Exceptions\InvalidPei;
use App\Domain\Exceptions\InvalidPeiDiscipline;
use App\Domain\Models\Pei;
use App\Domain\Models\PeiDiscipline;
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
