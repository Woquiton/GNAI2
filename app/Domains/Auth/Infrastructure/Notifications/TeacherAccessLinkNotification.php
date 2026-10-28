<?php

declare(strict_types=1);

namespace App\Domains\Auth\Infrastructure\Notifications;

use App\Domains\Auth\Domain\Models\SentEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Throwable;

final class TeacherAccessLinkNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** @return array<int, int> */
    public function backoff(): array
    {
        return [30, 120, 300];
    }

    public function __construct(
        private readonly string $confirmUrl,
        private readonly string $recipientEmail,
    ) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('GNAI - Seu link de acesso')
            ->view('emails.auth.teacher-access-link', [
                'confirmUrl' => $this->confirmUrl,
                'appName' => config('app.name', 'GNAI'),
            ]);
    }

    /**
     * Chamado pela fila depois de esgotar as tentativas. Sem isso, uma falha
     * de envio (ex.: senha de app do Gmail expirada) ficaria só no
     * failed_jobs, sem ninguém perceber — aqui registramos de forma visível
     * tanto no log da aplicação quanto em sent_emails.
     */
    public function failed(Throwable $exception): void
    {
        Log::error('Falha ao enviar e-mail de link de acesso do professor.', [
            'recipient' => $this->recipientEmail,
            'error' => $exception->getMessage(),
        ]);

        SentEmail::create([
            'recipient' => $this->recipientEmail,
            'type' => 'link_acesso',
            'status' => SentEmail::STATUS_FAILED,
            'error' => $exception->getMessage(),
            'created_at' => now(),
        ]);
    }
}
