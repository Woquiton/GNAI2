<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Backup;

use App\Domains\Application\Contracts\Backup\BackupArchiveStorageContract;
use App\Domains\Application\Contracts\Backup\PruneBackupsActionContract;
use App\Domains\Domain\DTOs\Backup\CreateBackupDTO;
use App\Domains\Domain\Enums\Backup\BackupStatus;
use App\Domains\Domain\Exceptions\Backup\BackupOperationFailed;
use App\Domains\Domain\Models\Backup\Backup;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class GenerateBackupAction
{
    public function __construct(
        private BackupArchiveStorageContract $archives,
        private PruneBackupsActionContract $pruneBackups,
    ) {}

    /**
     * @throws BackupOperationFailed
     */
    public function execute(?int $userId = null): Backup
    {
        $resolvedUserId = $userId ?? Auth::id();
        $archive = null;

        try {
            $archive = $this->archives->generateArchive();
        } catch (Throwable $exception) {
            Log::error('Falha ao gerar arquivo de backup.', [
                'user_id' => $resolvedUserId,
                'exception' => $exception,
            ]);

            throw new BackupOperationFailed('Falha ao gerar arquivo de backup.', previous: $exception);
        }

        try {
            $backupDTO = new CreateBackupDTO(
                fileName: $archive->fileName,
                filePath: $archive->filePath,
                size: $archive->size,
                status: BackupStatus::SUCCESS,
                userId: $resolvedUserId,
            );

            $backup = Backup::register($backupDTO);
            $backup->save();
        } catch (Throwable $exception) {
            if ($this->archives->archiveExists($archive->filePath)) {
                $deleted = $this->archives->deleteArchive($archive->filePath);

                if (! $deleted) {
                    Log::warning('Arquivo de backup gerado ficou órfão após falha ao registrar no banco.', [
                        'user_id' => $resolvedUserId,
                        'file_name' => $archive->fileName,
                        'file_path' => $archive->filePath,
                        'persistence_exception' => $exception,
                    ]);
                }
            }

            Log::error('Falha ao registrar backup gerado.', [
                'user_id' => $resolvedUserId,
                'file_name' => $archive->fileName,
                'file_path' => $archive->filePath,
                'exception' => $exception,
            ]);

            throw new BackupOperationFailed('Falha ao registrar backup gerado.', previous: $exception);
        }

        try {
            $this->pruneBackups->execute();
        } catch (Throwable $exception) {
            Log::error('Falha ao podar backups antigos após criação bem-sucedida.', [
                'backup_id' => $backup->id,
                'file_name' => $backup->file_name,
                'user_id' => $resolvedUserId,
                'exception' => $exception,
            ]);
        }

        return $backup;
    }
}
