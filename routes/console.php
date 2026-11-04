<?php

use App\Domains\Notifications\Application\Actions\Email\RecoverEmailResultsAction;
use App\Domains\Settings\Application\Queries\GetBackupSettingsQuery;
use App\Domains\Settings\Application\Queries\GetMailSettingsQuery;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:process-gmail-bounces')
    ->everyFiveMinutes()
    ->when(fn (): bool => app(GetMailSettingsQuery::class)->execute()?->monitorsGmailBounces() ?? false)
    ->withoutOverlapping(10)
    ->description('Atualiza os e-mails rejeitados pelo Gmail');

Schedule::call(fn () => app(RecoverEmailResultsAction::class)->execute())
    ->name('email-deliveries:recover-results')
    ->everyMinute()
    ->withoutOverlapping()
    ->description('Recupera resultados de e-mail sem repetir o envio');

// Roda o backup nos horários definidos em Configurações > Backups (fuso da aplicação).
// A retenção é aplicada pelo próprio backup automático, conforme as mesmas configurações.
Schedule::command('backup:automatic')
    ->everyMinute()
    ->when(fn (GetBackupSettingsQuery $settings): bool => $settings->execute()->isScheduledAt(now()))
    ->description('Backup automático nos horários definidos em Configurações');

// Roda verificacao de emprestimos em atraso
Schedule::command('loans:check-overdue')
    ->dailyAt('12:05')
    ->timezone('America/Bahia')
    ->onFailure(function () {
        Log::error('Falha ao processar verificação de empréstimos em atraso.');
    });
