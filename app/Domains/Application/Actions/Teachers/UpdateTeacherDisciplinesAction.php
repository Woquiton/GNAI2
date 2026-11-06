<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Teachers;

use App\Domains\Domain\Models\Semesters\Semester;
use App\Domains\Application\Data\Teachers\UpdateTeacherDisciplinesData;
use App\Domains\Domain\Exceptions\Teachers\InvalidTeacher;
use App\Domains\Domain\Models\Teachers\Teacher;
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
