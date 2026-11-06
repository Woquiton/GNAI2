<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Courses;

use App\Domains\Application\Data\Courses\CreateCourseData;
use App\Domains\Domain\DTOs\Courses\CreateCourseDTO;
use App\Domains\Domain\Models\Courses\Course;
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
