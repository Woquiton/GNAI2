<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\PeiDisciplines;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use App\Domains\Domain\Models\Peis\Pei;
use Illuminate\Support\Facades\DB;

final readonly class UpdatePeiDisciplineRemindersAction
{
    public function execute(PeiDiscipline $record, User $actor, bool $enabled): void
    {
        DB::transaction(function () use ($record, $actor, $enabled): void {
            Pei::query()->lockForUpdate()->findOrFail($record->pei_id);
            $locked = PeiDiscipline::query()->lockForUpdate()->findOrFail($record->getKey());
            $locked->ensureCanBeManagedBy((int) $actor->getKey(), $actor->isAdmin());
            if (($locked->reminders_stopped_at === null) === $enabled) {
                return;
            }
            $locked->reminders_stopped_at = $enabled ? null : now();
            $locked->reminders_stopped_by = $enabled ? null : $actor->getKey();
            if ($enabled) {
                // Retomar inicia um novo intervalo de cinco dias, sem aviso imediato.
                $locked->reminder_cycle_started_at = now();
            }
            $locked->save();
        });
    }
}
