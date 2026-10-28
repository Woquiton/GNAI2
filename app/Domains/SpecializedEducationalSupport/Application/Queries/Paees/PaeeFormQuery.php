<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Queries\Paees;

use App\Domains\SpecializedEducationalSupport\Domain\Enums\StudentDocumentType;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidPaee;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Paee;

final class PaeeFormQuery
{
    public function forCreation(CaseStudy $caseStudy): array
    {
        $caseStudy->load(['student.person', 'barriers']);

        $hasLaudo = $caseStudy->student->documents()
            ->where('type', StudentDocumentType::TECHNICAL_REPORT->value)
            ->exists();

        if ($caseStudy->status !== CaseStudy::STATUS_COMPLETED && !$hasLaudo) {
            throw new InvalidPaee('O PAEE só pode ser criado a partir de um Estudo de Caso concluído ou de um Laudo anexado ao aluno.');
        }

        return compact('caseStudy');
    }

    public function forUpdate(Paee $paee): array
    {
        $paee->load(['student.person', 'caseStudy.barriers', 'objectives', 'resources']);

        return compact('paee');
    }
}
