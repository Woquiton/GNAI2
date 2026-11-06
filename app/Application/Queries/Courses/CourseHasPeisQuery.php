<?php

declare(strict_types=1);

namespace App\Application\Queries\Courses;

use App\Domain\Models\Course;
use Illuminate\Support\Facades\DB;

final class CourseHasPeisQuery
{
    public function execute(Course $course): bool
    {
        return DB::table('peis')->where('course_id', $course->getKey())->exists();
    }
}
