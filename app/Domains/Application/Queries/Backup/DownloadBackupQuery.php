<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Backup;

use App\Domains\Application\Contracts\Backup\BackupArchiveStorageContract;
use App\Domains\Domain\Models\Backup\Backup;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

final readonly class DownloadBackupQuery
{
    public function __construct(
        private BackupArchiveStorageContract $archives,
    ) {}

    public function execute(Backup $backup): ?StreamedResponse
    {
        if (! $this->archives->archiveExists($backup->file_path)) {
            return null;
        }

        return Storage::disk('local')->download($backup->file_path, $backup->file_name);
    }
}
