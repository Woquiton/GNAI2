<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Courses;

use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Domain\Models\Disciplines\Discipline;
use Illuminate\Support\Facades\DB;

/**
 * Disciplinas, entre as informadas, que têm adaptações de PEI ou reprovação e risco de alunos do curso.
 * Elas não podem sair da matriz curricular.
 */
final class CourseDisciplinesInUseQuery
{
    /**
     * @param  list<int>  $disciplineIds
     * @return list<string> nomes das disciplinas em uso
     */
    public function execute(Course $course, array $disciplineIds): array
    {
        if ($disciplineIds === []) {
            return [];
        }

        $withAdaptations = DB::table('pei_disciplines')
            ->join('peis', 'peis.id', '=', 'pei_disciplines.pei_id')
            ->where('peis.course_id', $course->getKey())
            ->whereIn('pei_disciplines.discipline_id', $disciplineIds)
            ->pluck('pei_disciplines.discipline_id');
        $withAcademicRecords = DB::table('student_course_disciplines')
            ->join('student_courses', 'student_courses.id', '=', 'student_course_disciplines.student_course_id')
            ->where('student_courses.course_id', $course->getKey())
            ->whereIn('student_course_disciplines.discipline_id', $disciplineIds)
            ->pluck('student_course_disciplines.discipline_id');

        return Discipline::query()
            ->whereIn('id', $withAdaptations->merge($withAcademicRecords)->unique())
            ->orderBy('name')
            ->pluck('name')
            ->all();
    }
}
