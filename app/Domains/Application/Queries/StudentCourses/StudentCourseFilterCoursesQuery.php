<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\StudentCourses;

use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Domain\Models\Students\Student;

final class StudentCourseFilterCoursesQuery
{
    /**
     * @return array<int, string>
     */
    public function execute(Student $student): array
    {
        return Course::query()
            ->whereHas('studentCourses', static function ($query) use ($student): void {
                $query->where('student_id', $student->getKey());
            })
            ->orderBy('name')
            ->pluck('name', 'id')
            ->toArray();
    }
}
