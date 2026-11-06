<?php

declare(strict_types=1);

namespace App\Application\Actions\Disciplines;

use App\Application\Data\Disciplines\UpdateDisciplineData;
use App\Application\Queries\Disciplines\DisciplineHasCoursesQuery;
use App\Application\Queries\Disciplines\DisciplineHasTeachersQuery;
use App\Domain\DTOs\Disciplines\UpdateDisciplineDTO;
use App\Domain\Models\Discipline;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdateDisciplineAction
{
    public function __construct(
        private DisciplineHasCoursesQuery $hasCourses,
        private DisciplineHasTeachersQuery $hasTeachers,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Discipline $discipline, UpdateDisciplineData $data): Discipline
    {
        return DB::transaction(function () use ($discipline, $data): Discipline {
            $lockedDiscipline = Discipline::query()
                ->lockForUpdate()
                ->findOrFail($discipline->getKey());

            if ($lockedDiscipline->is_active && ! $data->isActive) {
                $lockedDiscipline->ensureCanBeDeactivated(
                    hasCourses: $this->hasCourses->execute($lockedDiscipline),
                    hasTeachers: $this->hasTeachers->execute($lockedDiscipline),
                );
            }

            $disciplineDTO = new UpdateDisciplineDTO(
                name: $data->name,
                description: $data->description,
                isActive: $data->isActive,
            );

            $lockedDiscipline->revise($disciplineDTO);
            $lockedDiscipline->save();

            return $lockedDiscipline;
        });
    }
}
