<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Notifications;

enum EmailMailboxFolder: string
{
    case ALL = 'all';
    case INBOX = 'inbox';
    case STARRED = 'starred';
    case DRAFTS = 'drafts';
    case OUTBOX = 'outbox';
    case SENT = 'sent';
    case ARCHIVE = 'archive';
    case SPAM = 'spam';
    case TRASH = 'trash';

    public function label(): string
    {
        return match ($this) {
            self::ALL => 'Principal',
            self::INBOX => 'Caixa de entrada',
            self::STARRED => 'Com estrela',
            self::DRAFTS => 'Rascunhos',
            self::OUTBOX => 'Caixa de saída',
            self::SENT => 'Enviados',
            self::ARCHIVE => 'Arquivo',
            self::SPAM => 'Spam',
            self::TRASH => 'Lixeira',
        };
    }
}
