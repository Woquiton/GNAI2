<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\StudentCourses;

use App\Domains\Inclusion\Domain\Enums\StudentCourseDisciplineCategory;
use App\Domains\Inclusion\Domain\Models\Semester;
use App\Domains\Inclusion\Domain\Models\StudentCourse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Dependências do aluno vistas a partir de um semestre: reprovações de semestres anteriores que não
 * foram aprovadas antes dele. Uma linha por disciplina, com o semestre da reprovação mais recente;
 * `resolved` indica a aprovação no próprio semestre consultado.
 */
final class StudentCourseDependenciesQuery
{
    /**
     * @return Collection<int, array{discipline_id: int, name: string, failed_semester_label: ?string, resolved: bool}>
     */
    public function execute(StudentCourse $studentCourse, Semester $semester): Collection
    {
        return DB::table('student_course_disciplines as records')
            ->join('disciplines', 'disciplines.id', '=', 'records.discipline_id')
            ->join('semesters as failed_semester', 'failed_semester.id', '=', 'records.semester_id')
            ->leftJoin('semesters as resolved_semester', 'resolved_semester.id', '=', 'records.resolved_semester_id')
            ->where('records.student_course_id', $studentCourse->getKey())
            ->where('records.category', StudentCourseDisciplineCategory::FAILED->value)
            ->where(fn ($query) => $query
                ->where('failed_semester.year', '<', $semester->year)
                ->orWhere(fn ($sameYear) => $sameYear
                    ->where('failed_semester.year', $semester->year)
                    ->where('failed_semester.term', '<', $semester->term)))
            // Aprovada antes deste semestre não é mais dependência; aprovada nele aparece marcada.
            ->where(fn ($query) => $query
                ->whereNull('records.resolved_semester_id')
                ->orWhere('resolved_semester.year', '>', $semester->year)
                ->orWhere(fn ($sameYear) => $sameYear
                    ->where('resolved_semester.year', $semester->year)
                    ->where('resolved_semester.term', '>=', $semester->term)))
            ->orderByDesc('failed_semester.year')
            ->orderByDesc('failed_semester.term')
            ->get([
                'records.discipline_id',
                'records.resolved_semester_id',
                'disciplines.name',
                'failed_semester.label as failed_semester_label',
            ])
            ->unique('discipline_id')
            ->sortBy('name')
            ->values()
            ->map(fn (object $row): array => [
                'discipline_id' => (int) $row->discipline_id,
                'name' => (string) $row->name,
                'failed_semester_label' => $row->failed_semester_label,
                'resolved' => (int) $row->resolved_semester_id === (int) $semester->getKey(),
            ]);
    }
}
