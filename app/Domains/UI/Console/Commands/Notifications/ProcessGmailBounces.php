<?php

declare(strict_types=1);

namespace App\Domains\UI\Console\Commands\Notifications;

use App\Domains\Application\Actions\Notifications\Email\ProcessGmailBouncesAction;
use App\Domains\Domain\Exceptions\Notifications\EmailMailboxUnavailable;
use App\Domains\Application\Queries\Settings\GetMailSettingsQuery;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

final class ProcessGmailBounces extends Command
{
    protected $signature = 'emails:process-gmail-bounces';

    protected $description = 'Lê avisos técnicos de rejeição do Gmail sem alterar a caixa postal';

    public function handle(GetMailSettingsQuery $settings, ProcessGmailBouncesAction $process): int
    {
        if (! $settings->execute()?->monitorsGmailBounces()) {
            $this->info('A leitura de rejeições do Gmail está desativada.');

            return self::SUCCESS;
        }
        if (! extension_loaded('imap')) {
            $this->error('A leitura de rejeições do Gmail requer a extensão PHP IMAP.');

            return self::FAILURE;
        }

        try {
            $count = $process->execute();
            $this->info($count === null ? 'Já existe uma leitura em andamento.' : 'Rejeições associadas: '.$count);

            return self::SUCCESS;
        } catch (Throwable $exception) {
            // Nunca registrar conteúdo da caixa ou credenciais.
            Log::error('Falha ao processar rejeições do Gmail.', ['error_type' => $exception::class]);
            $message = $exception instanceof EmailMailboxUnavailable
                ? $exception->getMessage()
                : 'Não foi possível processar as rejeições. Confira IMAP, credenciais, conexão e banco de dados.';
            $this->error($message);

            return self::FAILURE;
        }
    }
}
