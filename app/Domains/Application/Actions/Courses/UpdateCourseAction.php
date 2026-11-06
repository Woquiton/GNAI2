<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Courses;

use App\Domains\Application\Data\Courses\UpdateCourseData;
use App\Domains\Application\Queries\Courses\CourseDisciplinesInUseQuery;
use App\Domains\Application\Queries\Courses\CourseHasStudentsQuery;
use App\Domains\Domain\DTOs\Courses\UpdateCourseDTO;
use App\Domains\Domain\Models\Courses\Course;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdateCourseAction
{
    public function __construct(
        private CourseHasStudentsQuery $hasStudents,
        private CourseDisciplinesInUseQuery $disciplinesInUse,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Course $course, UpdateCourseData $data): Course
    {
        return DB::transaction(function () use ($course, $data): Course {
            $lockedCourse = Course::query()
                ->lockForUpdate()
                ->findOrFail($course->getKey());

            if ($lockedCourse->is_active && ! $data->isActive) {
                $lockedCourse->ensureCanBeDeactivated(
                    $this->hasStudents->execute($lockedCourse),
                );
            }

            $courseDTO = new UpdateCourseDTO(
                name: $data->name,
                isActive: $data->isActive,
                description: $data->description,
            );

            $removedDisciplineIds = array_values(array_diff(
                $lockedCourse->disciplines()->pluck('disciplines.id')->map(static fn (mixed $id): int => (int) $id)->all(),
                array_map('intval', $data->disciplineIds),
            ));
            $lockedCourse->ensureDisciplinesCanLeaveCurriculum(
                $this->disciplinesInUse->execute($lockedCourse, $removedDisciplineIds),
            );

            $lockedCourse->revise($courseDTO);
            $lockedCourse->save();
            $lockedCourse->assignCurriculum($data->disciplineIds, $data->disciplinePeriods);

            return $lockedCourse->load('disciplines');
        });
    }
}
