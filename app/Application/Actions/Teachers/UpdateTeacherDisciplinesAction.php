<?php

declare(strict_types=1);

namespace App\Application\Actions\Teachers;

use App\Application\Data\Teachers\UpdateTeacherDisciplinesData;
use App\Domain\Exceptions\InvalidTeacher;
use App\Domain\Models\Semester;
use App\Domain\Models\Teacher;
use DomainException;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdateTeacherDisciplinesAction
{
    /**
     * @throws InvalidTeacher
     * @throws Throwable
     */
    public function execute(Teacher $teacher, UpdateTeacherDisciplinesData $data): void
    {
        try {
            DB::transaction(function () use ($teacher, $data): void {
                $lockedTeacher = Teacher::query()
                    ->lockForUpdate()
                    ->findOrFail($teacher->getKey());

                $semester = Semester::query()->findOrFail($data->semesterId);

                $lockedTeacher->assignCourseDisciplines($semester, $data->assignments);
            });
        } catch (DomainException $exception) {
            throw new InvalidTeacher($exception->getMessage(), previous: $exception);
        }
    }
}
