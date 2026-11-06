<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Semesters;

use App\Domains\Application\Data\Semesters\CreateSemesterData;
use App\Domains\Domain\DTOs\Semesters\CreateSemesterDTO;
use App\Domains\Domain\Models\Semesters\Semester;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateSemesterAction
{
    /**
     * @throws Throwable
     */
    public function execute(CreateSemesterData $data): Semester
    {
        return DB::transaction(function () use ($data): Semester {
            // Serializa alterações no calendário antes de conferir intervalos.
            Semester::query()->orderBy('id')->lockForUpdate()->get();

            if ($data->isCurrent) {
                Semester::markCurrentAsHistorical();
            }

            $semesterDTO = new CreateSemesterDTO(
                year: $data->year,
                term: $data->term,
                startDate: $data->startDate,
                endDate: $data->endDate,
                isCurrent: $data->isCurrent,
            );

            $semester = Semester::register($semesterDTO);
            $semester->save();
            app(LinkUnassignedSemesterRecordsAction::class)->execute($semester);

            return $semester;
        });
    }
}
