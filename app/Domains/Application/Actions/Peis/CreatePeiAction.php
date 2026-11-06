<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Peis;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Paees\Paee;
use App\Domains\Domain\DTOs\Peis\CreatePeiDTO;
use App\Domains\Domain\Exceptions\Peis\InvalidPei;
use App\Domains\Domain\Models\Peis\Pei;
use App\Domains\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\Domain\Models\StudentCourses\StudentCourse;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreatePeiAction
{
    public function __construct(
        private CurrentSemesterQuery $currentSemesterQuery,
    ) {}

    /**
     * @throws InvalidPei
     * @throws Throwable
     */
    public function execute(Student $student, User $creator): Pei
    {
        return DB::transaction(function () use ($student, $creator): Pei {
            $lockedStudent = Student::query()
                ->lockForUpdate()
                ->findOrFail($student->getKey());
            $lockedStudent->ensureIsActive();

            $currentPei = Pei::query()
                ->where('student_id', $lockedStudent->getKey())
                ->where('is_current', true)
                ->lockForUpdate()
                ->first();

            if ($currentPei instanceof Pei) {
                $currentPei->ensureCanCreateNewVersion();
            }

            // A nova versão segue a matrícula vigente: se o aluno mudou de curso, o PEI acompanha.
            $studentCourse = StudentCourse::query()
                ->with('course')
                ->where('student_id', $lockedStudent->getKey())
                ->where('is_current', true)
                ->first();

            if (! $studentCourse instanceof StudentCourse) {
                throw new InvalidPei('Este aluno não possui matrícula vigente');
            }

            $course = $studentCourse->course;
            $version = $currentPei instanceof Pei ? ((int) $currentPei->version) + 1 : 1;

            $semester = $this->currentSemesterQuery->execute();
            if ($semester === null) {
                throw new InvalidPei('O sistema não possui semestre atual cadastrado');
            }

            $currentPaee = Paee::query()
                ->where('student_id', $lockedStudent->getKey())
                ->where('is_current', true)
                ->first();

            if (! $currentPaee instanceof Paee) {
                throw new InvalidPei('É necessário ter um PAEE ativo para criar o PEI.');
            }

            if ($currentPei instanceof Pei) {
                $currentPei->markAsHistorical();
                $currentPei->save();
            }

            $peiDTO = new CreatePeiDTO(
                creatorId: (int) $creator->getKey(),
                version: $version,
            );

            $pei = Pei::register(
                student: $lockedStudent,
                semester: $semester,
                course: $course,
                paee: $currentPaee,
                data: $peiDTO,
            );
            $pei->save();

            return $pei->load(['student.person', 'semester', 'course', 'paee']);
        });
    }
}
