<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Storage\Backup;

final readonly class BackupArchiveMetadata
{
    public function __construct(
        public string $fileName,
        public string $filePath,
        public string $size,
    ) {}
}
