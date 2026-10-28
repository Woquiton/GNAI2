<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Queries\CaseStudies;

use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidCaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;

final class CaseStudyFormQuery
{
    public function forCreation(Student $student): array
    {
        $student->loadMissing('person');

        return compact('student');
    }

    public function forUpdate(CaseStudy $caseStudy): array
    {
        $caseStudy->load(['student.person', 'barriers', 'strategies']);

        if ($caseStudy->status === CaseStudy::STATUS_COMPLETED) {
            throw new InvalidCaseStudy('Este Estudo de Caso já foi concluído e não pode mais ser editado.');
        }

        return compact('caseStudy');
    }
}
