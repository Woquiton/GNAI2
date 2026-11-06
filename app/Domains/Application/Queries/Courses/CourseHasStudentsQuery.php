<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Courses;

use App\Domains\Domain\Models\Courses\Course;

final class CourseHasStudentsQuery
{
    public function execute(Course $course): bool
    {
        return $course->studentCourses()->exists();
    }
}
