<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Actions\PeiDisciplineRevisions;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplineRevisions\AddPeiDisciplineRevisionData;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PeiDiscipline;
use Illuminate\Support\Facades\DB;
use Throwable;

final class AddPeiDisciplineRevisionAction
{
    /** @throws Throwable */
    public function execute(PeiDiscipline $peiDiscipline, AddPeiDisciplineRevisionData $data, User $reviewer): PeiDiscipline
    {
        return DB::transaction(function () use ($peiDiscipline, $data, $reviewer): PeiDiscipline {
            $lockedDiscipline = PeiDiscipline::query()->lockForUpdate()->findOrFail($peiDiscipline->getKey());

            $lockedDiscipline->revisions()->create([
                'reviewed_at' => now()->toDateString(),
                'what_changed' => $data->whatChanged,
                'why' => $data->why,
                'reviewer_id' => (int) $reviewer->getKey(),
            ]);

            return $lockedDiscipline->load(['discipline', 'teacher.person', 'creator', 'revisions.reviewer']);
        });
    }
}
