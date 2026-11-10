<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\StudentDocuments;

use App\Domains\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\Application\Data\StudentDocuments\CreateStudentDocumentData;
use App\Domains\Domain\DTOs\StudentDocuments\CreateStudentDocumentDTO;
use App\Domains\Domain\Exceptions\StudentDocuments\InvalidStudentDocument;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;
use App\Domains\Application\Queries\StudentDocuments\StudentDocumentCustomTypesQuery;
use App\Domains\Infrastructure\Storage\StudentDocuments\StudentDocumentStorage;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateStudentDocumentAction
{
    public function __construct(
        private StudentDocumentStorage $storage,
        private StudentDocumentCustomTypesQuery $customTypes,
        private CurrentSemesterQuery $currentSemesterQuery,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Student $student, CreateStudentDocumentData $data, int $uploaderId): StudentDocument
    {
        $student->ensureIsActive();
        $fileData = $this->storage->store(
            $data->file,
            (int) $student->getKey(),
            $data->type,
        );

        try {
            return DB::transaction(function () use ($student, $data, $uploaderId, $fileData): StudentDocument {
                $lockedStudent = Student::query()
                    ->lockForUpdate()
                    ->findOrFail($student->getKey());
                $lockedStudent->ensureIsActive();

                $semester = $this->currentSemesterQuery->execute();

                if ($semester === null) {
                    throw new InvalidStudentDocument('Não existe semestre atual configurado no sistema.');
                }

                $document = StudentDocument::register(
                    $lockedStudent,
                    $semester,
                    new CreateStudentDocumentDTO(
                        title: $data->title,
                        type: $data->type,
                        customType: $this->customTypes->canonicalName($data->customType),
                        showInTeacherPortal: $data->showInTeacherPortal,
                        filePath: $fileData['file_path'],
                        originalName: $fileData['original_name'],
                        mimeType: $fileData['mime_type'],
                        fileSize: $fileData['file_size'],
                        uploadedBy: $uploaderId,
                    ),
                );
                $document->save();

                return $document->load(['student.person', 'semester', 'uploader']);
            });
        } catch (Throwable $exception) {
            $this->storage->deleteQuietly($fileData['file_path']);

            throw $exception;
        }
    }
}
