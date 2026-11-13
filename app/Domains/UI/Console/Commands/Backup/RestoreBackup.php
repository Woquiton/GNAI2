<?php

declare(strict_types=1);

namespace App\Domains\UI\Console\Commands\Backup;

use App\Domains\Application\Actions\Backup\RestoreBackupAction;
use App\Domains\Application\Contracts\Backup\BackupArchiveStorageContract;
use App\Domains\Domain\DTOs\Backup\CreateBackupDTO;
use App\Domains\Domain\Enums\Backup\BackupStatus;
use App\Domains\Domain\Models\Backup\Backup;
use Illuminate\Console\Command;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Throwable;

final class RestoreBackup extends Command
{
    protected $signature = 'backup:restore {--file= : ZIP a importar e restaurar}';

    protected $description = 'Seleciona e restaura um backup completo pelas regras do sistema.';

    public function handle(BackupArchiveStorageContract $archives, RestoreBackupAction $restore): int
    {
        try {
            $file = $this->option('file');
            $backup = null;
            if (is_string($file) && $file !== '') {
                if (! is_file($file) || ! is_readable($file) || filesize($file) === 0) {
                    $this->components->error('Arquivo ZIP ausente, vazio ou sem permissão de leitura.');

                    return 2;
                }
                $description = $file;
            } else {
                $backups = Backup::query()->where('status', BackupStatus::SUCCESS->value)->latest('id')->get();
                $options = $backups->filter(fn (Backup $backup): bool => $archives->backupArchiveExists($backup))
                    ->mapWithKeys(fn (Backup $backup): array => [(string) $backup->id => '#'.$backup->id.' '.$backup->file_name])->all();
                if ($options === []) {
                    $this->components->warn('Nenhum backup disponível. Informe FILE=caminho para importar um ZIP.');

                    return 2;
                }
                $choice = $this->choice('Backup a restaurar', array_values($options));
                $backup = $backups->firstWhere('id', array_search($choice, $options, true));
                $description = $backup->file_name;
            }

            $this->components->warn('A restauração sobrescreve banco e uploads. Mantenha a APP_KEY original do backup.');
            if (! $this->confirm('Restaurar '.$description.'?', false)) {
                return 2;
            }

            if ($backup === null) {
                // A infraestrutura existente valida o ZIP antes de importá-lo.
                $archive = $archives->storeUploadedArchive(new UploadedFile($file, basename($file).'.zip', test: true));
                $backup = Backup::register(new CreateBackupDTO(
                    fileName: $archive->fileName,
                    filePath: $archive->filePath,
                    size: $archive->size,
                    status: BackupStatus::SUCCESS,
                    userId: null,
                ));
                $backup->save();
            }

            $alreadyDown = app()->isDownForMaintenance();
            if (! $alreadyDown && Artisan::call('down') !== 0) {
                throw new \RuntimeException('Não foi possível colocar a aplicação em manutenção.');
            }
            $restore->execute($backup);
            if (! $alreadyDown && Artisan::call('up') !== 0) {
                throw new \RuntimeException('Backup restaurado; não foi possível sair da manutenção.');
            }
            $this->components->info('Backup restaurado com sucesso.');

            return self::SUCCESS;
        } catch (Throwable $exception) {
            $this->components->error($exception->getMessage());

            return self::FAILURE;
        }
    }
}
