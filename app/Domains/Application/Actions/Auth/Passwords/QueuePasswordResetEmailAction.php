<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Passwords;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Actions\Notifications\Email\QueueEmailAction;
use App\Domains\Domain\DTOs\Notifications\EmailMessageDTO;

final readonly class QueuePasswordResetEmailAction
{
    public function __construct(private QueueEmailAction $queueEmail) {}

    public function execute(User $user, string $token): void
    {
        $expiresInMinutes = (int) config('auth.passwords.users.expire', 60);
        $this->queueEmail->execute(new EmailMessageDTO(
            contextType: 'user',
            contextId: (int) $user->getKey(),
            purpose: 'password_reset',
            deduplicationKey: 'password-reset:'.$user->getKey().':'.hash('sha256', $token),
            recipientEmail: $user->getEmailForPasswordReset(),
            recipientName: $user->name,
            subject: 'Redefinição de senha - Gnai',
            view: 'emails.notifications.alert',
            textView: 'emails.notifications.alert-text',
            payload: [
                'heading' => 'Recuperação de acesso',
                'greeting' => $user->name ? 'Olá, '.$user->name.'.' : 'Olá.',
                'paragraphs' => [
                    'Recebemos uma solicitação para redefinir a senha da sua conta no Gnai.',
                    "Para criar uma nova senha, clique no botão abaixo. O link é pessoal e expira em {$expiresInMinutes} minutos.",
                ],
                'actionLabel' => 'Redefinir minha senha',
                'actionUrl' => route('password.reset', [
                    'token' => $token,
                    'email' => $user->getEmailForPasswordReset(),
                ]),
                'outro' => 'Se você não solicitou essa recuperação, ignore este e-mail. Nenhuma alteração será feita sem acessar o link.',
            ],
        ));
    }
}
