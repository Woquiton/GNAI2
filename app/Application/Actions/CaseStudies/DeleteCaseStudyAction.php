<?php

declare(strict_types=1);

namespace App\Application\Actions\CaseStudies;

use App\Domain\Exceptions\InvalidCaseStudy;
use App\Domain\Models\CaseStudy;
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

            // Um a um, para a auditoria registrar cada exclusão.
            $lockedCaseStudy->strategies()->get()->each->delete();
            $lockedCaseStudy->barriers()->get()->each->delete();
            $lockedCaseStudy->contributions()->get()->each->delete();
            $lockedCaseStudy->delete();
        });
    }
}
