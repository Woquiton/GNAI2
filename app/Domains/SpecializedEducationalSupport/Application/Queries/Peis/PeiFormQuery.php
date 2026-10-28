<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Queries\Peis;

use App\Domains\SpecializedEducationalSupport\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidPei;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidStudent;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;

final readonly class PeiFormQuery
{
    public function __construct(
        private CurrentSemesterQuery $currentSemesterQuery,
    ) {}

    /**
     * @return array<string, mixed>
     *
     * @throws InvalidPei
     * @throws InvalidStudent
     */
    public function forCreation(Student $student): array
    {
        $student = $student->loadMissing(['person', 'currentCourse.course', 'currentPaee']);
        $student->ensureIsActive();

        $studentCourse = $student->currentCourse;
        if ($studentCourse === null) {
            throw new InvalidPei('Este aluno não possui matrícula vigente');
        }

        $currentPaee = $student->currentPaee;
        if ($currentPaee === null) {
            throw new InvalidPei('É necessário ter um PAEE ativo para criar o PEI.');
        }

        $semester = $this->currentSemesterQuery->execute();
        if ($semester === null) {
            throw new InvalidPei('O sistema não possui semestre atual configurado');
        }

        return [
            'student' => $student,
            'studentCourse' => $studentCourse,
            'course' => $studentCourse->course,
            'currentPaee' => $currentPaee,
            'semester' => $semester,
        ];
    }
}
