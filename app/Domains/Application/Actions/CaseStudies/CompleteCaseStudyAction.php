<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\CaseStudies;

use App\Domains\Domain\Exceptions\CaseStudies\InvalidCaseStudy;
use App\Domains\Domain\Models\CaseStudies\CaseStudy;
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
