<?php

declare(strict_types=1);

namespace App\Application\Actions\Pendencies;

use App\Domains\Auth\Domain\Models\User;
use App\Domain\Exceptions\InvalidPendency;
use App\Domain\Models\Pendency;
use App\Infrastructure\Notifications\PendencyCompletedNotification;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CompletePendencyAction
{
    /**
     * @throws InvalidPendency
     * @throws ModelNotFoundException
     * @throws Throwable
     */
    public function execute(Pendency $pendency, User $actor): Pendency
    {
        $completedPendency = DB::transaction(function () use ($pendency, $actor): Pendency {
            $lockedPendency = Pendency::query()
                ->with('creator')
                ->lockForUpdate()
                ->findOrFail($pendency->getKey());
            $lockedPendency->ensureCanBeCompletedBy($actor);
            $lockedPendency->markAsCompleted();
            $lockedPendency->save();

            return $lockedPendency->load(['creator', 'assignedProfessional.person']);
        });

        $completedPendency->creator?->notify(new PendencyCompletedNotification($completedPendency));

        return $completedPendency;
    }
}
