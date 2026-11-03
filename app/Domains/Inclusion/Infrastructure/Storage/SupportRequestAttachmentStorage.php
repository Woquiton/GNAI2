<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Infrastructure\Storage;

use App\Domains\Inclusion\Domain\Enums\StudentDocumentType;
use App\Domains\Inclusion\Domain\Models\SupportRequestAttachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

/** Reutiliza o armazenamento privado dos documentos de alunos. */
final readonly class SupportRequestAttachmentStorage
{
    public function __construct(private StudentDocumentStorage $documents) {}

    public function store(UploadedFile $file, int $studentId): array
    {
        return $this->documents->store($file, $studentId, StudentDocumentType::OTHER);
    }

    /**
     * @param  list<UploadedFile>  $files
     * @return list<array{file_path: string, original_name: string, mime_type: ?string, file_size: ?int}>
     *
     * @throws Throwable
     */
    public function storeMany(array $files, int $studentId): array
    {
        $stored = [];
        try {
            foreach ($files as $file) {
                $stored[] = $this->store($file, $studentId);
            }

            return $stored;
        } catch (Throwable $exception) {
            $this->deleteManyQuietly(array_column($stored, 'file_path'));

            throw $exception;
        }
    }

    /** @param list<string> $paths */
    public function deleteManyQuietly(array $paths): void
    {
        foreach ($paths as $path) {
            $this->deleteQuietly($path);
        }
    }

    public function deleteQuietly(?string $path): void
    {
        $this->documents->deleteQuietly($path);
    }

    public function download(SupportRequestAttachment $attachment): StreamedResponse
    {
        abort_unless(Storage::disk('local')->exists($attachment->file_path), 404, 'Anexo não encontrado.');

        return Storage::disk('local')->download($attachment->file_path, $attachment->original_name);
    }
}
