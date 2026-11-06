<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Students;

use App\Domains\Domain\Models\CaseStudies\CaseStudy;
use App\Domains\Domain\Models\Students\Student;
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
            ->get();
    }
}
