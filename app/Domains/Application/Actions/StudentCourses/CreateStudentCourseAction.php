<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\StudentCourses;

use App\Domains\Domain\Exceptions\Courses\InvalidCourse;
use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Application\Data\StudentCourses\CreateStudentCourseData;
use App\Domains\Domain\DTOs\StudentCourses\CreateStudentCourseDTO;
use App\Domains\Domain\Exceptions\StudentCourses\InvalidStudentCourse;
use App\Domains\Domain\Models\StudentCourses\StudentCourse;
use App\Domains\Domain\Exceptions\Students\InvalidStudent;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateStudentCourseAction
{
    /**
     * @throws InvalidCourse
     * @throws InvalidStudent
     * @throws InvalidStudentCourse
     * @throws ModelNotFoundException
     * @throws Throwable
     */
    public function execute(Student $student, CreateStudentCourseData $data): StudentCourse
    {
        return DB::transaction(function () use ($student, $data): StudentCourse {
            $lockedStudent = Student::query()
                ->lockForUpdate()
                ->findOrFail($student->getKey());
            $lockedStudent->ensureIsActive();

            $course = Course::query()
                ->findOrFail($data->courseId);
            $course->ensureIsActive();

            $existingStudentCourses = StudentCourse::query()
                ->where('student_id', $lockedStudent->getKey())
                ->lockForUpdate()
                ->get();
            $studentAlreadyHasCourse = $existingStudentCourses->contains(
                static fn (StudentCourse $studentCourse): bool => (int) $studentCourse->course_id === (int) $course->getKey()
            );

            if ($studentAlreadyHasCourse) {
                throw new InvalidStudentCourse('Este aluno já possui vínculo com o curso selecionado.');
            }

            $isCurrent = $data->isCurrent || $existingStudentCourses->isEmpty();

            if ($isCurrent) {
                $existingStudentCourses
                    ->where('is_current', true)
                    ->each(function (StudentCourse $studentCourse): void {
                        $studentCourse->markAsNotCurrent();
                        $studentCourse->save();
                    });
            }

            $studentCourseDTO = new CreateStudentCourseDTO(
                academicYear: $data->academicYear,
                semesterId: $data->semesterId,
                isCurrent: $isCurrent,
                schoolAttendanceStatus: $isCurrent ? $data->schoolAttendanceStatus : null,
            );

            $studentCourse = StudentCourse::register(
                student: $lockedStudent,
                course: $course,
                data: $studentCourseDTO,
            );

            try {
                $studentCourse->save();
            } catch (UniqueConstraintViolationException $exception) {
                throw new InvalidStudentCourse(
                    'Este aluno já possui vínculo com o curso selecionado. Recarregue a página e tente novamente.',
                    previous: $exception,
                );
            }

            $studentCourse->syncCoursePeriod($data->semesterId, $data->coursePeriod);

            if ($isCurrent) {
                $studentCourse->syncDisciplines(
                    course: $course,
                    semesterId: $data->semesterId,
                    failedDisciplineIds: $data->failedDisciplineIds,
                    atRiskDisciplineIds: $data->atRiskDisciplineIds,
                );
            }

            return $studentCourse->load(['student.person', 'course', 'failedDisciplines', 'atRiskDisciplines']);
        });
    }
}
