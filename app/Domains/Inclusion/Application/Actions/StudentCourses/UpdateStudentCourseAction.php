<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Actions\StudentCourses;

use App\Domains\Inclusion\Application\Data\StudentCourses\UpdateStudentCourseData;
use App\Domains\Inclusion\Application\Queries\StudentCourses\StudentCourseDependenciesQuery;
use App\Domains\Inclusion\Domain\DTOs\StudentCourses\UpdateStudentCourseDTO;
use App\Domains\Inclusion\Domain\Exceptions\InvalidCourse;
use App\Domains\Inclusion\Domain\Exceptions\InvalidStudent;
use App\Domains\Inclusion\Domain\Exceptions\InvalidStudentCourse;
use App\Domains\Inclusion\Domain\Models\Course;
use App\Domains\Inclusion\Domain\Models\Semester;
use App\Domains\Inclusion\Domain\Models\StudentCourse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdateStudentCourseAction
{
    public function __construct(
        private StudentCourseDependenciesQuery $dependencies,
    ) {}

    /**
     * @throws InvalidCourse
     * @throws InvalidStudent
     * @throws InvalidStudentCourse
     * @throws ModelNotFoundException
     * @throws Throwable
     */
    public function execute(StudentCourse $studentCourse, UpdateStudentCourseData $data): StudentCourse
    {
        return DB::transaction(function () use ($studentCourse, $data): StudentCourse {
            $lockedStudentCourse = StudentCourse::query()
                ->with('student')
                ->lockForUpdate()
                ->findOrFail($studentCourse->getKey());
            $lockedStudentCourse->student->ensureIsActive();
            if (! $lockedStudentCourse->is_current) {
                throw new InvalidStudentCourse('Cursos anteriores são históricos e não podem mais ser editados.');
            }

            $course = Course::query()
                ->findOrFail($data->courseId);
            $course->ensureIsActive();

            $studentAlreadyHasCourse = StudentCourse::query()
                ->where('student_id', $lockedStudentCourse->student_id)
                ->where('course_id', $course->getKey())
                ->where('id', '!=', $lockedStudentCourse->getKey())
                ->exists();

            if ($studentAlreadyHasCourse) {
                throw new InvalidStudentCourse('Este aluno já possui vínculo com o curso selecionado.');
            }

            $studentCourseDTO = new UpdateStudentCourseDTO(
                academicYear: $data->academicYear,
                semesterId: $data->semesterId,
                schoolAttendanceStatus: $data->schoolAttendanceStatus,
            );

            $lockedStudentCourse->revise(
                course: $course,
                data: $studentCourseDTO,
            );

            try {
                $lockedStudentCourse->save();
            } catch (UniqueConstraintViolationException $exception) {
                throw new InvalidStudentCourse(
                    'Este aluno já possui vínculo com o curso selecionado. Recarregue a página e tente novamente.',
                    previous: $exception,
                );
            }

            $lockedStudentCourse->syncCoursePeriod($data->semesterId, $data->coursePeriod);

            $lockedStudentCourse->syncDisciplines(
                course: $course,
                semesterId: $data->semesterId,
                failedDisciplineIds: $data->failedDisciplineIds,
                atRiskDisciplineIds: $data->atRiskDisciplineIds,
            );

            if ($data->semesterId !== null) {
                $semester = Semester::query()->findOrFail($data->semesterId);

                $lockedStudentCourse->resolveDependencies(
                    semester: $semester,
                    disciplineIds: $data->resolvedDependencyIds,
                    dependencyIds: $this->dependencies->execute($lockedStudentCourse, $semester)
                        ->pluck('discipline_id')
                        ->all(),
                );
            }

            return $lockedStudentCourse->load(['student.person', 'course', 'failedDisciplines', 'atRiskDisciplines']);
        });
    }
}
