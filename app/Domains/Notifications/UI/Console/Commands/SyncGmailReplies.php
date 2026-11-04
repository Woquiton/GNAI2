<?php

declare(strict_types=1);

namespace App\Domains\Notifications\UI\Console\Commands;

use App\Domains\Notifications\Application\Actions\Email\SyncGmailRepliesAction;
use App\Domains\Notifications\Domain\Exceptions\EmailMailboxUnavailable;
use App\Domains\Settings\Application\Queries\GetMailSettingsQuery;
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
