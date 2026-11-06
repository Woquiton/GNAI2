<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Backup;

use App\Domains\Application\Contracts\Backup\BackupArchiveStorageContract;
use App\Domains\Domain\Exceptions\Backup\BackupOperationFailed;
use App\Domains\Domain\Exceptions\Backup\InvalidBackup;
use App\Domains\Domain\Models\Backup\Backup;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class RestoreBackupAction
{
    public function __construct(
        private BackupArchiveStorageContract $archives,
    ) {}

    /**
     * Restaura banco e storage a partir de um backup persistido e restaurável.
     *
     * Operação destrutiva: sobrescreve o estado atual do sistema com o conteúdo do arquivo selecionado.
     * A autorização HTTP fica na rota/controller; esta action protege as regras do caso de uso.
     *
     * @throws InvalidBackup
     * @throws BackupOperationFailed
     */
    public function execute(Backup $backup): void
    {
        $backup->ensureCanBeRestored();

        if (! $this->archives->backupArchiveExists($backup)) {
            throw new InvalidBackup("Arquivo físico não encontrado: {$backup->file_name}");
        }

        Log::info('Iniciando restauração de backup.', [
            'backup_id' => $backup->id,
            'file_name' => $backup->file_name,
        ]);

        try {
            $this->archives->restoreArchive($backup);

            Log::info('Restauração de backup concluída.', [
                'backup_id' => $backup->id,
                'file_name' => $backup->file_name,
            ]);
        } catch (Throwable $exception) {
            Log::error('Falha ao restaurar backup.', [
                'backup_id' => $backup->id,
                'file_name' => $backup->file_name,
                'exception' => $exception,
            ]);

            throw new BackupOperationFailed('Falha ao restaurar backup.', previous: $exception);
        }
    }
}
