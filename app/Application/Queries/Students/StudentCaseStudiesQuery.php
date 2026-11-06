<?php

declare(strict_types=1);

namespace App\Application\Queries\Students;

use App\Domain\Models\CaseStudy;
use App\Domain\Models\Student;
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
