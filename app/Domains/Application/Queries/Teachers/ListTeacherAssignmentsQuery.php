<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Teachers;

use App\Domains\Application\Data\Teachers\ListTeacherAssignmentsData;
use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListTeacherAssignmentsQuery
{
    public function execute(int $teacherId, ListTeacherAssignmentsData $filters): LengthAwarePaginator
    {
        return PeiDiscipline::query()
            ->select('pei_disciplines.*')
            ->join('peis', 'peis.id', '=', 'pei_disciplines.pei_id')
            ->join('students', 'students.id', '=', 'peis.student_id')
            ->join('people', 'people.id', '=', 'students.person_id')
            ->where('pei_disciplines.teacher_id', $teacherId)
            ->where('peis.is_current', true)
            ->when(filled($filters->student), fn ($query) => $query
                ->where('people.name', 'like', '%'.trim($filters->student).'%'))
            ->when(filled($filters->discipline), fn ($query) => $query
                ->whereHas('discipline', fn ($discipline) => $discipline
                    ->where('name', 'like', '%'.trim($filters->discipline).'%')))
            ->when(filled($filters->course), fn ($query) => $query
                ->whereHas('pei.course', fn ($course) => $course
                    ->where('name', 'like', '%'.trim($filters->course).'%')))
            ->with(['discipline', 'pei.student.person', 'pei.course'])
            ->orderBy('people.name')
            ->orderBy('pei_disciplines.id')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
