<?php

declare(strict_types=1);

namespace App\Domains\Application\Contracts\Backup;

use App\Domains\Domain\Models\Backup\Backup;
use App\Domains\Infrastructure\Storage\Backup\BackupArchiveMetadata;
use Illuminate\Http\UploadedFile;

interface BackupArchiveStorageContract
{
    public function generateArchive(): BackupArchiveMetadata;

    public function storeUploadedArchive(UploadedFile $file): BackupArchiveMetadata;

    public function deleteArchive(string $filePath): bool;

    public function archiveExists(string $filePath): bool;

    public function backupArchiveExists(Backup $backup): bool;

    /**
     * @return list<BackupArchiveMetadata>
     */
    public function listStoredArchives(): array;

    public function restoreArchive(Backup $backup): void;
}
