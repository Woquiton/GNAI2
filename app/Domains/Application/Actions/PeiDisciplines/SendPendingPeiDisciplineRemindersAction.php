<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\PeiDisciplines;

use App\Domains\Application\Queries\Peis\TeacherPeiAccessQuery;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use App\Domains\Domain\Models\Peis\Pei;
use App\Domains\Infrastructure\Notifications\PeiDisciplines\PeiDisciplineNotification;
use Illuminate\Support\Facades\DB;

final readonly class SendPendingPeiDisciplineRemindersAction
{
    public function __construct(private TeacherPeiAccessQuery $access) {}

    public function execute(): int
    {
        $sent = 0;
        $threshold = today()->subDays(5)->endOfDay();
        PeiDiscipline::query()
            ->whereNull('reminders_stopped_at')
            ->where('created_at', '<=', $threshold)
            ->where(fn ($query) => $query->whereNull('reminder_cycle_started_at')->orWhere('reminder_cycle_started_at', '<=', $threshold))
            ->whereHas('pei', fn ($pei) => $pei->where('is_current', true)->where('is_finished', false)
                ->whereHas('student', fn ($student) => $student->where('status', StudentStatus::ACTIVE->value)))
            ->select(['id', 'pei_id'])
            ->chunkById(100, function ($records) use (&$sent, $threshold): void {
                foreach ($records as $record) {
                    $sent += DB::transaction(function () use ($record, $threshold): int {
                        // Mesma ordem de locks da edição: PEI antes da adaptação.
                        $pei = Pei::query()->with('student')->lockForUpdate()->find($record->pei_id);
                        $locked = PeiDiscipline::query()->lockForUpdate()->find($record->getKey());
                        if ($pei === null || $locked === null || ! $pei->is_current || $pei->is_finished
                            || $pei->student?->status !== StudentStatus::ACTIVE
                            || $locked->reminders_stopped_at !== null || $locked->hasPlanningContent()
                            || $locked->created_at->greaterThan($threshold)
                            || $locked->reminder_cycle_started_at?->greaterThan($threshold)) {
                            return 0;
                        }

                        $recipient = $locked->creator;
                        if ($recipient === null || ! $recipient->can('pei-discipline.view') || ! $this->access->canView($pei, $recipient)) {
                            return 0;
                        }

                        $days = (int) $locked->created_at->copy()->startOfDay()->diffInDays(today());
                        $recipient->notify(new PeiDisciplineNotification($locked, 'pending', $days));
                        $locked->reminder_cycle_started_at = now();
                        $locked->save();

                        return 1;
                    });
                }
            });

        return $sent;
    }
}
