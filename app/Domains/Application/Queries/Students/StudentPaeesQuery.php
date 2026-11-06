<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Students;

use App\Domains\Domain\Models\Paees\Paee;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Database\Eloquent\Collection;

final class StudentPaeesQuery
{
    /** @return Collection<int, Paee> */
    public function execute(Student $student): Collection
    {
        return Paee::query()
            ->with(['creator', 'semester', 'caseStudy'])
            ->where('student_id', $student->getKey())
            ->orderByDesc('version')
            ->get();
    }
}
