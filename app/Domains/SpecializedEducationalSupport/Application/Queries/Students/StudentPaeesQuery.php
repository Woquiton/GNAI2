<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Queries\Students;

use App\Domains\SpecializedEducationalSupport\Domain\Models\Paee;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;
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
            ->limit(5)
            ->get();
    }
}
