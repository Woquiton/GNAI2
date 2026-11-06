<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Semesters;

use App\Domains\Application\Data\Semesters\UpdateSemesterData;
use App\Domains\Domain\DTOs\Semesters\UpdateSemesterDTO;
use App\Domains\Domain\Models\Semesters\Semester;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdateSemesterAction
{
    /**
     * @throws Throwable
     */
    public function execute(Semester $semester, UpdateSemesterData $data): Semester
    {
        return DB::transaction(function () use ($semester, $data): Semester {
            // Serializa alterações no calendário antes de conferir intervalos.
            Semester::query()->orderBy('id')->lockForUpdate()->get();

            $lockedSemester = Semester::query()
                ->lockForUpdate()
                ->findOrFail($semester->getKey());

            if ($data->isCurrent) {
                Semester::markCurrentAsHistorical(except: $lockedSemester);
            }

            $semesterDTO = new UpdateSemesterDTO(
                year: $data->year,
                term: $data->term,
                startDate: $data->startDate,
                endDate: $data->endDate,
                isCurrent: $data->isCurrent,
            );

            $lockedSemester->revise($semesterDTO);
            $lockedSemester->save();
            app(LinkUnassignedSemesterRecordsAction::class)->execute($lockedSemester);

            return $lockedSemester;
        });
    }
}
