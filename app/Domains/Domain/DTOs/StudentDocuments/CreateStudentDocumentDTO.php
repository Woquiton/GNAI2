<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\StudentDocuments;

use App\Domains\Domain\Enums\StudentDocuments\StudentDocumentType;

final readonly class CreateStudentDocumentDTO
{
    public function __construct(
        public string $title,
        public StudentDocumentType $type,
        public string $filePath,
        public string $originalName,
        public ?string $mimeType,
        public ?int $fileSize,
        public int $uploadedBy,
        public ?string $customType = null,
        public bool $showInTeacherPortal = false,
    ) {}
}
