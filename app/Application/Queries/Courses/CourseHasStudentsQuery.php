<?php

declare(strict_types=1);

namespace App\Application\Queries\Courses;

use App\Domain\Models\Course;

final class CourseHasStudentsQuery
{
    public function execute(Course $course): bool
    {
        return $course->studentCourses()->exists();
    }
}
