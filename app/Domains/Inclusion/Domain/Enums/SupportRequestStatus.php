<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Enums;

enum SupportRequestStatus: string
{
    case RECEIVED = 'received';
    case IN_REVIEW = 'in_review';
    case REFERRED = 'referred';
    case CLOSED = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::RECEIVED => 'Recebida',
            self::IN_REVIEW => 'Em análise',
            self::REFERRED => 'Encaminhada',
            self::CLOSED => 'Concluída',
        };
    }
}
