<?php

declare(strict_types=1);

namespace App\Application\Actions\Courses;

use App\Application\Queries\Courses\CourseHasPeisQuery;
use App\Application\Queries\Courses\CourseHasStudentsQuery;
use App\Domain\Models\Course;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteCourseAction
{
    public function __construct(
        private CourseHasStudentsQuery $hasStudents,
        private CourseHasPeisQuery $hasPeis,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Course $course): void
    {
        DB::transaction(function () use ($course): void {
            $lockedCourse = Course::query()
                ->lockForUpdate()
                ->findOrFail($course->getKey());

            $lockedCourse->ensureCanBeDeleted(
                $this->hasStudents->execute($lockedCourse),
                $this->hasPeis->execute($lockedCourse),
            );

            $lockedCourse->delete();
        });
    }
}
