<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\Teachers;

use App\Domains\Inclusion\Domain\Models\Semester;
use App\Domains\Inclusion\Domain\Models\TeacherCourseDiscipline;

/** Semestre mais recente, anterior ao informado, que tem vínculos de professores para copiar. */
final class PreviousAssignmentSemesterQuery
{
    public function execute(Semester $target, ?int $teacherId = null): ?Semester
    {
        return Semester::query()
            ->where(fn ($query) => $query
                ->where('year', '<', $target->year)
                ->orWhere(fn ($sameYear) => $sameYear
                    ->where('year', $target->year)
                    ->where('term', '<', $target->term)))
            ->whereIn(
                'id',
                TeacherCourseDiscipline::query()
                    ->when($teacherId !== null, fn ($query) => $query->where('teacher_id', $teacherId))
                    ->select('semester_id'),
            )
            ->orderByDesc('year')
            ->orderByDesc('term')
            ->first();
    }
}
