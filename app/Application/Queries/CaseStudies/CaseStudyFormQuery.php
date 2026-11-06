<?php

declare(strict_types=1);

namespace App\Application\Queries\CaseStudies;

use App\Domain\Exceptions\InvalidCaseStudy;
use App\Domain\Models\CaseStudy;
use App\Domain\Models\Student;

final class CaseStudyFormQuery
{
    public function forCreation(Student $student): array
    {
        $student->ensureNotInIntake();
        $student->loadMissing('person');

        return compact('student');
    }

    public function forUpdate(CaseStudy $caseStudy): array
    {
        $caseStudy->load(['student.person', 'barriers', 'strategies']);
        $caseStudy->student->ensureNotInIntake();

        if ($caseStudy->status === CaseStudy::STATUS_COMPLETED) {
            throw new InvalidCaseStudy('Este Estudo de Caso já foi concluído e não pode mais ser editado.');
        }

        return compact('caseStudy');
    }
}
