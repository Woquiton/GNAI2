<?php

declare(strict_types=1);

namespace App\Application\Actions\Courses;

use App\Application\Data\Courses\CreateCourseData;
use App\Domain\DTOs\Courses\CreateCourseDTO;
use App\Domain\Models\Course;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateCourseAction
{
    /**
     * @throws Throwable
     */
    public function execute(CreateCourseData $data): Course
    {
        return DB::transaction(function () use ($data): Course {
            $courseDTO = new CreateCourseDTO(
                name: $data->name,
                description: $data->description,
            );

            $course = Course::register($courseDTO);
            $course->save();
            $course->assignCurriculum($data->disciplineIds, $data->disciplinePeriods);

            return $course->load('disciplines');
        });
    }
}
