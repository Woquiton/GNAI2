<?php

declare(strict_types=1);

namespace App\Domains\UI\Console\Commands\Backup;

use App\Domains\Infrastructure\Database\Backup\MysqlCommandRunner;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Throwable;

final class DatabaseMaintenance extends Command
{
    protected $signature = 'database:maintain {operation : console, dump, restore, reset ou seed} {--file= : Arquivo SQL}';

    protected $description = 'Abre o MySQL, exporta SQL ou restaura um dump com confirmação.';

    public function handle(MysqlCommandRunner $mysql): int
    {
        try {
            return match ($this->argument('operation')) {
                'console' => $this->console($mysql),
                'dump' => $this->dump($mysql),
                'restore' => $this->restore($mysql),
                'reset', 'seed' => $this->seed(),
                default => $this->invalidOperation(),
            };
        } catch (Throwable $exception) {
            $this->components->error($exception->getMessage());

            return self::FAILURE;
        }
    }

    private function console(MysqlCommandRunner $mysql): int
    {
        $mysql->execute('mysql', [], terminal: true);

        return self::SUCCESS;
    }

    private function dump(MysqlCommandRunner $mysql): int
    {
        $directory = storage_path('app/private/'.config('backup.backup.name').'/db');
        File::ensureDirectoryExists($directory, 0700);
        $path = $directory.'/database-'.now()->format('Ymd-His').'-'.bin2hex(random_bytes(4)).'.sql';
        $temporary = $path.'.partial';
        $output = fopen($temporary, 'xb');
        if ($output === false) {
            throw new \RuntimeException('Não foi possível criar o arquivo SQL.');
        }
        chmod($temporary, 0600);

        try {
            $mysql->execute('mysqldump', ['--single-transaction', '--quick', '--skip-lock-tables', '--skip-ssl'], output: $output);
            if (! fflush($output) || fstat($output)['size'] === 0) {
                throw new \RuntimeException('O dump gerado está vazio ou não pôde ser salvo.');
            }
            if (! rename($temporary, $path)) {
                throw new \RuntimeException('Falha ao publicar o arquivo SQL.');
            }
        } finally {
            fclose($output);
            if (is_file($temporary)) {
                unlink($temporary);
            }
        }
        $this->components->info('Backup SQL concluído: '.$path);

        return self::SUCCESS;
    }

    private function restore(MysqlCommandRunner $mysql): int
    {
        $path = $this->option('file');
        if (! is_string($path) || $path === '') {
            $files = File::glob(storage_path('app/private/'.config('backup.backup.name').'/db/*.sql'));
            if ($files === []) {
                $this->components->warn('Nenhum SQL encontrado. Use FILE=caminho no host.');

                return 2;
            }
            $path = $this->choice('Arquivo SQL a restaurar', $files);
        }
        if (! is_file($path) || ! is_readable($path) || filesize($path) === 0) {
            $this->components->error('Arquivo SQL ausente, vazio ou sem permissão de leitura.');

            return 2;
        }
        $database = config('database.connections.'.config('database.default').'.database');
        if (! $this->confirm("Sobrescrever o banco {$database} com {$path}?", false)) {
            return 2;
        }

        $alreadyDown = app()->isDownForMaintenance();
        if (! $alreadyDown && Artisan::call('down') !== 0) {
            throw new \RuntimeException('Não foi possível colocar a aplicação em manutenção.');
        }
        $input = fopen($path, 'rb');
        if ($input === false) {
            throw new \RuntimeException('Não foi possível abrir o SQL. Aplicação mantida em manutenção.');
        }
        try {
            $mysql->execute('mysql', ['--skip-ssl'], input: $input);
        } finally {
            fclose($input);
        }
        if (! $alreadyDown && Artisan::call('up') !== 0) {
            throw new \RuntimeException('SQL restaurado; não foi possível sair da manutenção.');
        }
        $this->components->info('Banco restaurado.');

        return self::SUCCESS;
    }

    private function seed(): int
    {
        $reset = $this->argument('operation') === 'reset';
        $database = config('database.connections.'.config('database.default').'.database');
        $this->components->warn('Este comando carrega dados demonstrativos. Não faz parte do deploy.');
        $expected = ($reset ? 'apagar ' : 'popular ').$database;
        if ($this->ask('Para confirmar, digite '.$expected) !== $expected) {
            return 2;
        }
        $alreadyDown = app()->isDownForMaintenance();
        if (! $alreadyDown && Artisan::call('down') !== 0) {
            throw new \RuntimeException('Não foi possível colocar a aplicação em manutenção.');
        }
        $status = $this->call($reset ? 'migrate:fresh' : 'db:seed', $reset
            ? ['--seed' => true, '--force' => true]
            : ['--force' => true]);
        if ($status !== self::SUCCESS) {
            throw new \RuntimeException('A operação falhou. Aplicação mantida em manutenção.');
        }
        if ($reset && $this->call('permissions:sync') !== self::SUCCESS) {
            throw new \RuntimeException('Falha ao sincronizar permissões após recriar o banco.');
        }
        if (! $alreadyDown && Artisan::call('up') !== 0) {
            throw new \RuntimeException('Não foi possível sair da manutenção.');
        }

        return self::SUCCESS;
    }

    private function invalidOperation(): int
    {
        $this->components->error('Use console, dump, restore, reset ou seed.');

        return self::INVALID;
    }
}
