<?php

declare(strict_types=1);

namespace App\Application\Actions\CaseStudies;

use App\Domain\Exceptions\InvalidCaseStudy;
use App\Domain\Models\CaseStudy;
use Illuminate\Support\Facades\DB;
use Throwable;

final class CompleteCaseStudyAction
{
    /**
     * @throws InvalidCaseStudy
     * @throws Throwable
     */
    public function execute(CaseStudy $caseStudy): CaseStudy
    {
        return DB::transaction(function () use ($caseStudy): CaseStudy {
            $lockedCaseStudy = CaseStudy::query()
                ->with(['barriers', 'strategies'])
                ->lockForUpdate()
                ->findOrFail($caseStudy->getKey());

            $lockedCaseStudy->ensureCanBeCompleted();
            $lockedCaseStudy->markAsCompleted();
            $lockedCaseStudy->save();

            return $lockedCaseStudy->load(['student.person', 'semester', 'barriers', 'strategies', 'contributions.author']);
        });
    }
}
