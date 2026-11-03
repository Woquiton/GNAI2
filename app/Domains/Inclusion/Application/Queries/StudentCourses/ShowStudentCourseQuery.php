<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\StudentCourses;

use App\Domains\Inclusion\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\Inclusion\Domain\Enums\StudentCourseDisciplineCategory;
use App\Domains\Inclusion\Domain\Models\Semester;
use App\Domains\Inclusion\Domain\Models\StudentCourse;
use Illuminate\Support\Facades\DB;

final readonly class ShowStudentCourseQuery
{
    public function __construct(
        private CurrentSemesterQuery $currentSemester,
        private StudentCourseDependenciesQuery $dependencies,
    ) {}

    public function execute(StudentCourse $studentCourse): StudentCourse
    {
        return $studentCourse->load([
            'student.person',
            'course.disciplines',
            'semester',
            'semesterRecords' => static fn ($query) => $query
                ->join('semesters', 'semesters.id', '=', 'student_course_semesters.semester_id')
                ->orderByDesc('semesters.year')
                ->orderByDesc('semesters.term')
                ->select('student_course_semesters.*'),
            'semesterRecords.semester',
        ]);
    }

    /**
     * Reprovações e riscos agrupados por semestre, do mais recente para o mais antigo.
     *
     * @return list<array{semester_id: int, semester_label: string, failed: list<string>, at_risk: list<string>, resolved: list<string>}>
     */
    public function academicHistory(StudentCourse $studentCourse): array
    {
        $records = DB::table('student_course_disciplines as records')
            ->join('disciplines', 'disciplines.id', '=', 'records.discipline_id')
            ->join('semesters', 'semesters.id', '=', 'records.semester_id')
            ->where('records.student_course_id', $studentCourse->getKey())
            ->orderByDesc('semesters.year')
            ->orderByDesc('semesters.term')
            ->orderBy('disciplines.name')
            ->get(['records.semester_id', 'semesters.label', 'records.category', 'disciplines.name']);
        $resolved = DB::table('student_course_disciplines as records')
            ->join('disciplines', 'disciplines.id', '=', 'records.discipline_id')
            ->where('records.student_course_id', $studentCourse->getKey())
            ->whereNotNull('records.resolved_semester_id')
            ->orderBy('disciplines.name')
            ->get(['records.resolved_semester_id', 'disciplines.name'])
            ->groupBy('resolved_semester_id');
        $resolvedSemesters = Semester::query()
            ->whereIn('id', $resolved->keys())
            ->get(['id', 'label', 'year', 'term']);

        $history = $records
            ->groupBy('semester_id')
            ->map(fn ($rows, $semesterId): array => [
                'semester_id' => (int) $semesterId,
                'semester_label' => (string) $rows->first()->label,
                'failed' => $rows->where('category', StudentCourseDisciplineCategory::FAILED->value)->pluck('name')->values()->all(),
                'at_risk' => $rows->where('category', StudentCourseDisciplineCategory::AT_ACADEMIC_RISK->value)->pluck('name')->values()->all(),
                'resolved' => $resolved->get($semesterId, collect())->pluck('name')->unique()->values()->all(),
            ]);

        // Semestres em que só houve aprovação de dependências também entram no histórico.
        foreach ($resolvedSemesters as $semester) {
            if (! $history->has($semester->getKey())) {
                $history->put($semester->getKey(), [
                    'semester_id' => (int) $semester->getKey(),
                    'semester_label' => (string) $semester->label,
                    'failed' => [],
                    'at_risk' => [],
                    'resolved' => $resolved->get($semester->getKey(), collect())->pluck('name')->unique()->values()->all(),
                ]);
            }
        }

        $order = Semester::query()
            ->whereIn('id', $history->keys())
            ->orderByDesc('year')
            ->orderByDesc('term')
            ->pluck('id')
            ->map(static fn (mixed $id): int => (int) $id)
            ->all();

        return collect($order)->map(fn (int $id): array => $history->get($id))->values()->all();
    }

    /**
     * Dependências ainda não aprovadas, vistas a partir do semestre da matrícula ou, sem ele, do
     * semestre atual.
     *
     * @return list<array{discipline_id: int, name: string, failed_semester_label: ?string}>
     */
    public function pendingDependencies(StudentCourse $studentCourse): array
    {
        $semester = $studentCourse->semester ?? $this->currentSemester->execute();

        if (! $semester instanceof Semester) {
            return [];
        }

        return $this->dependencies->execute($studentCourse, $semester)
            ->reject(fn (array $dependency): bool => $dependency['resolved'])
            ->map(fn (array $dependency): array => [
                'discipline_id' => $dependency['discipline_id'],
                'name' => $dependency['name'],
                'failed_semester_label' => $dependency['failed_semester_label'],
            ])
            ->values()
            ->all();
    }
}
