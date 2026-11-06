<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Courses;

use App\Domains\Domain\Models\Courses\Course;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class ShowCourseQuery
{
    public function execute(Course $course): Course
    {
        return $course->load([
            'disciplines' => static function (BelongsToMany $query): void {
                $query->orderBy('name');
            },
        ]);
    }
}
