<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Queries\Students;

use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;
use Illuminate\Database\Eloquent\Collection;

final class StudentCaseStudiesQuery
{
    /** @return Collection<int, CaseStudy> */
    public function execute(Student $student): Collection
    {
        return CaseStudy::query()
            ->with(['creator', 'semester'])
            ->where('student_id', $student->getKey())
            ->orderByDesc('version')
            ->limit(5)
            ->get();
    }

    /** @return Collection<int, CaseStudy> */
    public function history(Student $student): Collection
    {
        return CaseStudy::query()
            ->with(['creator', 'semester', 'barriers', 'strategies'])
            ->where('student_id', $student->getKey())
            ->orderBy('version')
            ->get();
    }
}
