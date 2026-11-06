<?php

declare(strict_types=1);

namespace App\Domains\UI\Console\Commands\Notifications;

use App\Domains\Application\Actions\Notifications\Email\SyncGmailRepliesAction;
use App\Domains\Domain\Exceptions\Notifications\EmailMailboxUnavailable;
use App\Domains\Application\Queries\Settings\GetMailSettingsQuery;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

final class SyncGmailReplies extends Command
{
    protected $signature = 'emails:sync-gmail-replies';

    protected $description = 'Importa respostas do Gmail vinculadas aos e-mails enviados pelo Gnai';

    public function handle(GetMailSettingsQuery $settings, SyncGmailRepliesAction $sync): int
    {
        if (! $settings->execute()?->receivesGmailReplies()) {
            $this->info('O recebimento de respostas do Gmail está desativado nas configurações.');

            return self::SUCCESS;
        }
        try {
            $count = $sync->execute();
            $this->info($count === null ? 'Já existe uma consulta em andamento.' : 'Respostas importadas: '.$count);

            return self::SUCCESS;
        } catch (Throwable $exception) {
            Log::warning('Falha ao importar respostas do Gmail.', ['error_type' => $exception::class]);
            $this->error($exception instanceof EmailMailboxUnavailable ? $exception->getMessage() : 'Não foi possível importar as respostas. Confira a conexão e o banco de dados.');

            return self::FAILURE;
        }
    }
}
