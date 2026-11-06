<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Courses;

use App\Domains\Domain\Models\Courses\Course;
use Illuminate\Support\Facades\DB;

final class CourseHasPeisQuery
{
    public function execute(Course $course): bool
    {
        return DB::table('peis')->where('course_id', $course->getKey())->exists();
    }
}
