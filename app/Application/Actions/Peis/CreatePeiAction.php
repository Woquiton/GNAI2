<?php

declare(strict_types=1);

namespace App\Application\Actions\Peis;

use App\Domains\Auth\Domain\Models\User;
use App\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domain\DTOs\Peis\CreatePeiDTO;
use App\Domain\Exceptions\InvalidPei;
use App\Domain\Models\Paee;
use App\Domain\Models\Pei;
use App\Domain\Models\Student;
use App\Domain\Models\StudentCourse;
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
