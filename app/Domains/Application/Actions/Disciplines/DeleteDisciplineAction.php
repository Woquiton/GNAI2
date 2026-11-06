<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Disciplines;

use App\Domains\Application\Queries\Disciplines\DisciplineHasCoursesQuery;
use App\Domains\Application\Queries\Disciplines\DisciplineHasPeiAdaptationsQuery;
use App\Domains\Application\Queries\Disciplines\DisciplineHasStudentCourseRecordsQuery;
use App\Domains\Application\Queries\Disciplines\DisciplineHasTeachersQuery;
use App\Domains\Domain\Models\Disciplines\Discipline;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteDisciplineAction
{
    public function __construct(
        private DisciplineHasTeachersQuery $hasTeachers,
        private DisciplineHasCoursesQuery $hasCourses,
        private DisciplineHasStudentCourseRecordsQuery $hasStudentCourseRecords,
        private DisciplineHasPeiAdaptationsQuery $hasPeiAdaptations,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Discipline $discipline): void
    {
        DB::transaction(function () use ($discipline): void {
            $lockedDiscipline = Discipline::query()
                ->lockForUpdate()
                ->findOrFail($discipline->getKey());

            $lockedDiscipline->ensureCanBeDeleted(
                hasTeachers: $this->hasTeachers->execute($lockedDiscipline),
                hasCourses: $this->hasCourses->execute($lockedDiscipline),
                hasStudentCourseRecords: $this->hasStudentCourseRecords->execute($lockedDiscipline),
                hasPeiAdaptations: $this->hasPeiAdaptations->execute($lockedDiscipline),
            );

            $lockedDiscipline->delete();
        });
    }
}
