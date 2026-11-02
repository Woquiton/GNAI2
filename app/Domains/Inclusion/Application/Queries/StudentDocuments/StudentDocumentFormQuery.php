<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\StudentDocuments;

use App\Domains\Inclusion\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\Inclusion\Domain\Enums\StudentDocumentType;
use App\Domains\Inclusion\Domain\Exceptions\InvalidStudentDocument;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\Domain\Models\StudentDocument;

final class StudentDocumentFormQuery
{
    public function __construct(
        private readonly CurrentSemesterQuery $currentSemesterQuery,
    ) {}

    /**
     * @throws InvalidStudentDocument
     */
    public function forCreation(Student $student): array
    {
        $student->ensureIsActive();
        $semester = $this->currentSemesterQuery->execute();

        if ($semester === null) {
            throw new InvalidStudentDocument(
                'Não existe semestre atual configurado no sistema.'
            );
        }

        return [
            'student' => $student->loadMissing('person'),
            'types' => StudentDocumentType::labels(),
            'semester' => $semester,
        ];
    }

    public function forUpdate(StudentDocument $document): array
    {
        $student = $document->student;
        $student->ensureIsActive();

        return [
            'studentDocument' => $document,
            'student' => $student->loadMissing('person'),
            'types' => StudentDocumentType::labels(),
            'semester' => $this->currentSemesterQuery->execute(),
        ];
    }
}
