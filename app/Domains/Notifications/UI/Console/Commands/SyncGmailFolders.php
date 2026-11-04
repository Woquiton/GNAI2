<?php

declare(strict_types=1);

namespace App\Domains\Notifications\UI\Console\Commands;

use App\Domains\Notifications\Application\Actions\Email\SyncGmailFoldersAction;
use App\Domains\Notifications\Domain\Exceptions\EmailMailboxUnavailable;
use App\Domains\Settings\Application\Queries\GetMailSettingsQuery;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

final class SyncGmailFolders extends Command
{
    protected $signature = 'emails:sync-gmail-folders';

    protected $description = 'Atualiza as pastas do Gnai a partir dos marcadores atuais no Gmail';

    public function handle(GetMailSettingsQuery $settings, SyncGmailFoldersAction $sync): int
    {
        if (! $settings->execute()?->syncsGmailFolders()) {
            $this->info('A sincronização de pastas do Gmail está desativada.');

            return self::SUCCESS;
        }
        try {
            $count = $sync->execute();
            $this->info($count === null ? 'Já existe uma consulta em andamento.' : 'Pastas conferidas: '.$count);

            return self::SUCCESS;
        } catch (Throwable $exception) {
            Log::warning('Falha ao sincronizar pastas do Gmail.', ['error_type' => $exception::class]);
            $this->error($exception instanceof EmailMailboxUnavailable ? $exception->getMessage() : 'Não foi possível atualizar as pastas do Gmail.');

            return self::FAILURE;
        }
    }
}
