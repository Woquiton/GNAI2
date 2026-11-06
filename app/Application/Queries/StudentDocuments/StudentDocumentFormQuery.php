<?php

declare(strict_types=1);

namespace App\Application\Queries\StudentDocuments;

use App\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domain\Enums\StudentDocumentType;
use App\Domain\Exceptions\InvalidStudentDocument;
use App\Domain\Models\Student;
use App\Domain\Models\StudentDocument;

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
