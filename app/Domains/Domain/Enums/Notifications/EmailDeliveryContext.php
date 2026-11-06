<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Notifications;

enum EmailDeliveryContext: string
{
    case LOAN = 'loan';
    case WAITLIST = 'waitlist';
    case SESSION = 'session';
    case TEACHER = 'teacher';
    case USER = 'user';
    case SETTINGS = 'settings';
    case MAILBOX = 'mailbox';

    public function label(): string
    {
        return match ($this) {
            self::LOAN => 'Empréstimos',
            self::WAITLIST => 'Fila de espera',
            self::SESSION => 'Agendamentos',
            self::TEACHER => 'Acesso de professores',
            self::USER => 'Contas de usuário',
            self::SETTINGS => 'Configurações',
            self::MAILBOX => 'Inbox',
        };
    }
}
