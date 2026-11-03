<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\StudentCourses;

use App\Domains\Inclusion\Domain\Enums\StudentCourseDisciplineCategory;
use App\Domains\Inclusion\Domain\Exceptions\InvalidStudent;
use App\Domains\Inclusion\Domain\Exceptions\InvalidStudentCourse;
use App\Domains\Inclusion\Domain\Models\Course;
use App\Domains\Inclusion\Domain\Models\Semester;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\Domain\Models\StudentCourse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

final readonly class StudentCourseFormQuery
{
    public function __construct(
        private StudentCourseDependenciesQuery $dependencies,
    ) {}

    /**
     * @return array<string, mixed>
     *
     * @throws InvalidStudent
     */
    public function forCreation(Student $student): array
    {
        $student->ensureIsActive();
        $student->loadMissing('person');
        $mustBeCurrent = ! $student->studentCourses()->exists();

        return [
            'student' => $student,
            'courses' => $this->activeCourses(),
            'semesters' => $this->semesters(),
            'mustBeCurrent' => $mustBeCurrent,
            'maxCoursePeriod' => Course::MAX_COURSE_PERIOD,
            // O semestre atual é o padrão dos novos registros.
            'currentSemesterId' => Semester::query()->where('is_current', true)->value('id'),
        ];
    }

    /**
     * @return array<string, mixed>
     *
     * @throws InvalidStudent
     */
    public function forUpdate(StudentCourse $studentCourse): array
    {
        $studentCourse->loadMissing(['student.person', 'course.disciplines', 'semester']);
        $studentCourse->student->ensureIsActive();
        if (! $studentCourse->is_current) {
            throw new InvalidStudentCourse('Cursos anteriores são históricos e não podem mais ser editados.');
        }

        $semesters = $this->semesters();

        return [
            'studentCourse' => $studentCourse,
            'courses' => $this->activeCourses(),
            'semesters' => $semesters,
            'academicRecordsBySemester' => $this->academicRecordsBySemester($studentCourse, $semesters),
            'coursePeriod' => $studentCourse->coursePeriodIn(
                $studentCourse->semester_id === null ? null : (int) $studentCourse->semester_id,
            ),
            'maxCoursePeriod' => Course::MAX_COURSE_PERIOD,
        ];
    }

    /**
     * Período, reprovações, riscos e dependências da matrícula em cada semestre, para o formulário trocar os
     * valores ao mudar o semestre sem nova requisição.
     *
     * @param  Collection<int, Semester>  $semesters
     * @return array<int, array{course_period: ?int, failed: list<int>, at_risk: list<int>, dependencies: list<array<string, mixed>>}>
     */
    private function academicRecordsBySemester(StudentCourse $studentCourse, Collection $semesters): array
    {
        $records = DB::table('student_course_disciplines')
            ->where('student_course_id', $studentCourse->getKey())
            ->get(['semester_id', 'discipline_id', 'category'])
            ->groupBy('semester_id');

        return $semesters
            ->mapWithKeys(function (Semester $semester) use ($records, $studentCourse): array {
                $semesterRecords = $records->get($semester->getKey(), collect());
                $idsOf = fn (StudentCourseDisciplineCategory $category): array => $semesterRecords
                    ->where('category', $category->value)
                    ->pluck('discipline_id')
                    ->map(static fn (mixed $id): int => (int) $id)
                    ->values()
                    ->all();

                return [(int) $semester->getKey() => [
                    'course_period' => $studentCourse->coursePeriodIn((int) $semester->getKey()),
                    'failed' => $idsOf(StudentCourseDisciplineCategory::FAILED),
                    'at_risk' => $idsOf(StudentCourseDisciplineCategory::AT_ACADEMIC_RISK),
                    'dependencies' => $this->dependencies->execute($studentCourse, $semester)->all(),
                ]];
            })
            ->all();
    }

    /**
     * @return Collection<int, Course>
     */
    private function activeCourses(): Collection
    {
        return Course::query()
            ->with(['disciplines' => static fn ($query) => $query->orderBy('name')])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    /**
     * @return Collection<int, Semester>
     */
    private function semesters(): Collection
    {
        return Semester::query()
            ->orderByDesc('year')
            ->orderByDesc('term')
            ->get();
    }
}
