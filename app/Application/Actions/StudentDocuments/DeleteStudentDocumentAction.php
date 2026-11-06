<?php

declare(strict_types=1);

namespace App\Application\Actions\StudentDocuments;

use App\Domain\Models\StudentDocument;
use App\Infrastructure\Storage\StudentDocumentStorage;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteStudentDocumentAction
{
    public function __construct(
        private StudentDocumentStorage $storage,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(StudentDocument $document): void
    {
        $filePath = DB::transaction(function () use ($document): string {
            $lockedDocument = StudentDocument::query()
                ->lockForUpdate()
                ->findOrFail($document->getKey());
            $filePath = $lockedDocument->file_path;
            $lockedDocument->delete();

            return $filePath;
        });

        $this->storage->deleteQuietly($filePath);
    }
}
