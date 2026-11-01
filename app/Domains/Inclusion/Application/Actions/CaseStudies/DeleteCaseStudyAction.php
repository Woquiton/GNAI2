<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Actions\CaseStudies;

use App\Domains\Inclusion\Domain\Exceptions\InvalidCaseStudy;
use App\Domains\Inclusion\Domain\Models\CaseStudy;
use Illuminate\Support\Facades\DB;
use Throwable;

final class DeleteCaseStudyAction
{
    /**
     * @throws InvalidCaseStudy
     * @throws Throwable
     */
    public function execute(CaseStudy $caseStudy): void
    {
        DB::transaction(function () use ($caseStudy): void {
            $lockedCaseStudy = CaseStudy::query()->lockForUpdate()->findOrFail($caseStudy->getKey());

            if ($lockedCaseStudy->paees()->exists()) {
                throw new InvalidCaseStudy('Não é possível remover um Estudo de Caso que já possui PAEE vinculado.');
            }

            $lockedCaseStudy->strategies()->delete();
            $lockedCaseStudy->barriers()->delete();
            $lockedCaseStudy->contributions()->delete();
            $lockedCaseStudy->delete();
        });
    }
}
