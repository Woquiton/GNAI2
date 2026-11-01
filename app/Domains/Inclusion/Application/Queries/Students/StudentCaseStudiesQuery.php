<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\Students;

use App\Domains\Inclusion\Domain\Models\CaseStudy;
use App\Domains\Inclusion\Domain\Models\Student;
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
