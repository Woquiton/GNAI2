<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Peis;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Peis\Pei;
use Illuminate\Support\Facades\DB;
use Throwable;

final class DeletePeiAction
{
    /**
     * @throws Throwable
     */
    public function execute(Pei $pei, User $user): int
    {
        return DB::transaction(function () use ($pei, $user): int {
            $lockedPei = Pei::query()
                ->lockForUpdate()
                ->findOrFail($pei->getKey());
            $lockedPei->ensureCanBeManagedBy((int) $user->getKey(), $user->isAdmin());

            $studentId = (int) $lockedPei->student_id;
            $lockedPei->delete();

            return $studentId;
        });
    }
}
