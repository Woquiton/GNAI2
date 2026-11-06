<?php

declare(strict_types=1);

namespace App\Application\Queries\Teachers;

use App\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domain\Models\Course;
use App\Domain\Models\Semester;
use App\Domain\Models\Teacher;
use App\Domain\Models\TeacherCourseDiscipline;
use Illuminate\Database\Eloquent\Collection;

final readonly class TeacherDisciplinesFormQuery
{
    public function __construct(
        private CurrentSemesterQuery $currentSemester,
        private PreviousAssignmentSemesterQuery $previousSemester,
    ) {}

    /**
     * Vínculos do professor no semestre escolhido; sem escolha, no semestre atual ou no mais recente.
     *
     * @return array<string, mixed>
     */
    public function execute(Teacher $teacher, ?int $semesterId = null): array
    {
        $teacher->load('person');
        $semesters = Semester::query()->orderByDesc('year')->orderByDesc('term')->get(['id', 'label']);
        $semester = ($semesterId !== null ? Semester::query()->find($semesterId) : null)
            ?? $this->currentSemester->execute()
            ?? $semesters->first();

        $selectedByCourse = $semester instanceof Semester
            ? TeacherCourseDiscipline::query()
                ->where('teacher_id', $teacher->getKey())
                ->where('semester_id', $semester->getKey())
                ->get()
                ->groupBy('course_id')
                ->map(fn ($items) => $items->pluck('discipline_id')->toArray())
                ->toArray()
            : [];
        $previousSemester = $semester instanceof Semester
            ? $this->previousSemester->execute($semester, (int) $teacher->getKey())
            : null;

        return [
            'teacher' => $teacher,
            'courses' => $this->activeCoursesWithDisciplines(),
            'selectedByCourse' => $selectedByCourse,
            'semesters' => $semesters,
            'semester' => $semester?->only(['id', 'label']),
            'previousSemester' => $previousSemester?->only(['id', 'label']),
        ];
    }

    /**
     * @return Collection<int, Course>
     */
    private function activeCoursesWithDisciplines(): Collection
    {
        return Course::query()
            ->with(['disciplines' => function ($query): void {
                $query->where('is_active', true)->orderBy('name');
            }])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }
}
