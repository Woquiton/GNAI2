<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Actions\Courses;

use App\Domains\Inclusion\Application\Data\Courses\RolloverCourseSemesterData;
use App\Domains\Inclusion\Domain\Enums\StudentStatus;
use App\Domains\Inclusion\Domain\Exceptions\InvalidStudentCourse;
use App\Domains\Inclusion\Domain\Models\Course;
use App\Domains\Inclusion\Domain\Models\Semester;
use App\Domains\Inclusion\Domain\Models\StudentCourse;
use App\Domains\Inclusion\Domain\Models\StudentCourseSemester;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * Virada de semestre em lote: registra no semestre de destino o período de cada aluno do curso e passa a
 * matrícula a apontar para esse semestre. Alunos marcados como "não registrar" ficam como estão.
 */
final readonly class RolloverCourseSemesterAction
{
    /**
     * @return int quantidade de alunos registrados no semestre
     *
     * @throws InvalidStudentCourse
     * @throws ValidationException
     * @throws Throwable
     */
    public function execute(Course $course, RolloverCourseSemesterData $data): int
    {
        return DB::transaction(function () use ($course, $data): int {
            $target = Semester::query()->findOrFail($data->semesterId);
            $studentCourses = StudentCourse::query()
                ->with(['student', 'semesterRecords.semester'])
                ->whereIn('id', array_map(static fn (array $row): int => (int) $row['student_course_id'], $data->rows))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');
            $errors = [];
            $plans = [];

            foreach ($data->rows as $index => $row) {
                if ($row['action'] === 'skip') {
                    continue;
                }

                $studentCourse = $studentCourses->get((int) $row['student_course_id']);

                if (
                    ! $studentCourse instanceof StudentCourse
                    || (int) $studentCourse->course_id !== (int) $course->getKey()
                    || ! $studentCourse->is_current
                    || $studentCourse->student?->status !== StudentStatus::ACTIVE
                ) {
                    throw new InvalidStudentCourse(
                        'A lista mudou enquanto você editava: um dos alunos não tem mais matrícula vigente neste curso. Recarregue a página e tente novamente.'
                    );
                }

                $informedPeriod = filled($row['course_period'] ?? null) ? (int) $row['course_period'] : null;
                $period = $studentCourse->rolloverCoursePeriod($target, $row['action'], $informedPeriod);

                if ($period === null) {
                    $errors["rows.{$index}.course_period"] = 'Informe o período do curso deste aluno.';
                } elseif ($period > Course::MAX_COURSE_PERIOD) {
                    $errors["rows.{$index}.action"] = 'O aluno já está no último período aceito. Escolha "Permanece" ou "Não registrar".';
                } else {
                    $plans[] = [$studentCourse, $period];
                }
            }

            if ($errors !== []) {
                throw ValidationException::withMessages($errors);
            }

            foreach ($plans as [$studentCourse, $period]) {
                StudentCourseSemester::record($studentCourse, $target, $period);
                // Um registro por vez: a mudança do semestre da matrícula entra na auditoria.
                $studentCourse->fill([
                    'semester_id' => $target->getKey(),
                    'academic_year' => $target->year,
                ]);
                $studentCourse->save();
            }

            return count($plans);
        });
    }
}
