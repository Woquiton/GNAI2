<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Peis;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Peis\Pei;
use Illuminate\Support\Facades\DB;
use Throwable;

final class FinishPeiAction
{
    /**
     * @throws Throwable
     */
    public function execute(Pei $pei, User $user): Pei
    {
        return DB::transaction(function () use ($pei, $user): Pei {
            $lockedPei = Pei::query()
                ->with(['peiDisciplines.discipline'])
                ->lockForUpdate()
                ->findOrFail($pei->getKey());
            $lockedPei->ensureCanBeManagedBy((int) $user->getKey(), $user->isAdmin());
            $lockedPei->ensureCanBeFinished();
            $lockedPei->markAsFinished();
            $lockedPei->save();

            return $lockedPei->load(['student.person', 'semester', 'course', 'paee']);
        });
    }
}
