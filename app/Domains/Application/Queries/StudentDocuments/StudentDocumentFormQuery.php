<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\StudentDocuments;

use App\Domains\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\Domain\Enums\StudentDocuments\StudentDocumentType;
use App\Domains\Domain\Exceptions\StudentDocuments\InvalidStudentDocument;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;
use App\Domains\Domain\Models\Students\Student;

final class StudentDocumentFormQuery
{
    public function __construct(
        private readonly CurrentSemesterQuery $currentSemesterQuery,
        private readonly StudentDocumentCustomTypesQuery $customTypes,
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
            'customTypes' => $this->customTypes->execute(),
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
            'customTypes' => $this->customTypes->execute(),
            'semester' => $this->currentSemesterQuery->execute(),
        ];
    }
}
