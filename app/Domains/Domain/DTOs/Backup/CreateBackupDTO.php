<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Backup;

use App\Domains\Domain\Enums\Backup\BackupStatus;

final readonly class CreateBackupDTO
{
    public function __construct(
        public string $fileName,
        public string $filePath,
        public string $size,
        public BackupStatus $status,
        public ?int $userId = null,
    ) {}
}
