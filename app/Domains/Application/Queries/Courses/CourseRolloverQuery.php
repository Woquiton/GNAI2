<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Courses;

use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\Domain\Models\Semesters\Semester;
use App\Domains\Domain\Models\StudentCourses\StudentCourse;
use App\Domains\Domain\Enums\Students\StudentStatus;

/**
 * Tela da virada de semestre de um curso: alunos ativos com matrícula vigente, o período em que estavam
 * no último semestre anterior ao de destino e a situação sugerida.
 */
final readonly class CourseRolloverQuery
{
    public function __construct(
        private CurrentSemesterQuery $currentSemester,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function execute(Course $course, ?int $semesterId = null): array
    {
        $semesters = Semester::query()->orderByDesc('year')->orderByDesc('term')->get(['id', 'label', 'year', 'term']);
        $target = ($semesterId !== null ? $semesters->firstWhere('id', $semesterId) : null)
            ?? $this->currentSemester->execute()
            ?? $semesters->first();

        $students = $target instanceof Semester
            ? StudentCourse::query()
                ->with(['student.person', 'semesterRecords.semester'])
                ->where('course_id', $course->getKey())
                ->where('is_current', true)
                ->whereHas('student', fn ($query) => $query->where('status', StudentStatus::ACTIVE->value))
                ->get()
                ->map(function (StudentCourse $studentCourse) use ($target): array {
                    $previous = $studentCourse->semesterRecordBefore($target);

                    return [
                        'student_course_id' => (int) $studentCourse->getKey(),
                        'student_name' => (string) ($studentCourse->student?->person?->name ?? ''),
                        'registration' => $studentCourse->student?->registration,
                        'previous_period' => $previous?->course_period,
                        'previous_semester_label' => $previous?->semester?->label,
                        'target_period' => $studentCourse->coursePeriodIn((int) $target->getKey()),
                        'default_action' => $studentCourse->defaultRolloverAction($target),
                    ];
                })
                ->sortBy('student_name', SORT_NATURAL | SORT_FLAG_CASE)
                ->values()
            : collect();

        return [
            'course' => $course->only(['id', 'name']),
            'semesters' => $semesters->map(fn (Semester $semester): array => $semester->only(['id', 'label']))->values(),
            'semester' => $target?->only(['id', 'label']),
            'maxCoursePeriod' => Course::MAX_COURSE_PERIOD,
            'students' => $students,
        ];
    }
}
