<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Notifications;

enum EmailPurpose: string
{
    case LOAN_CONFIRMATION = 'loan_confirmation';
    case LOAN_RETURNED = 'loan_returned';
    case WAITLIST_REGISTERED = 'waitlist_registered';
    case WAITLIST_AVAILABLE = 'waitlist_available';
    case TEACHER_ACCESS = 'teacher_access_link';
    case PASSWORD_RESET = 'password_reset';
    case SESSION_CREATED = 'session_created';
    case SESSION_UPDATED = 'session_updated';
    case SESSION_CANCELLED = 'session_cancelled';
    case SESSION_DELETED = 'session_deleted';
    case MAIL_TEST = 'mail_test';
    case MANUAL = 'manual';
    case INCOMING = 'incoming';

    public function label(): string
    {
        return match ($this) {
            self::LOAN_CONFIRMATION => 'Confirmação de empréstimo',
            self::LOAN_RETURNED => 'Confirmação de devolução',
            self::WAITLIST_REGISTERED => 'Inscrição na fila de espera',
            self::WAITLIST_AVAILABLE => 'Disponibilidade de item',
            self::TEACHER_ACCESS => 'Link de acesso do professor',
            self::PASSWORD_RESET => 'Redefinição de senha',
            self::SESSION_CREATED => 'Agendamento criado',
            self::SESSION_UPDATED => 'Agendamento atualizado',
            self::SESSION_CANCELLED => 'Agendamento cancelado',
            self::SESSION_DELETED => 'Agendamento excluído',
            self::MAIL_TEST => 'Teste de configuração',
            self::MANUAL => 'Mensagem escrita no sistema',
            self::INCOMING => 'Resposta recebida',
        };
    }
}
