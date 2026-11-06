<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Paees;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Data\Paees\AddPaeeReviewData;
use App\Domains\Domain\Models\Paees\Paee;
use Illuminate\Support\Facades\DB;
use Throwable;

final class AddPaeeReviewAction
{
    /** @throws Throwable */
    public function execute(Paee $paee, AddPaeeReviewData $data, User $reviewer): Paee
    {
        return DB::transaction(function () use ($paee, $data, $reviewer): Paee {
            $lockedPaee = Paee::query()->lockForUpdate()->findOrFail($paee->getKey());

            $lockedPaee->student()->lockForUpdate()->firstOrFail()->ensureNotInIntake();

            $lockedPaee->reviews()->create([
                'reviewed_at' => now()->toDateString(),
                'what_changed' => $data->whatChanged,
                'why' => $data->why,
                'reviewer_id' => (int) $reviewer->getKey(),
            ]);

            $lockedPaee->markAsUnderReview();
            $lockedPaee->save();

            return $lockedPaee->load(['caseStudy', 'student.person', 'semester', 'objectives', 'resources', 'reviews.reviewer']);
        });
    }
}
