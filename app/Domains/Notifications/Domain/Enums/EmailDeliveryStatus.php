<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Domain\Enums;

enum EmailDeliveryStatus: string
{
    case QUEUED = 'queued';
    case PROCESSING = 'processing';
    case SENT = 'sent';
    case FAILED = 'failed';
    case NO_EMAIL = 'no_email';
    case NOT_SENT = 'not_sent';
    case UNCONFIRMED = 'unconfirmed';

    public function label(): string
    {
        return match ($this) {
            self::QUEUED => 'E-mail na fila',
            self::PROCESSING => 'Enviando e-mail',
            self::SENT => 'E-mail enviado',
            self::FAILED => 'Falha no envio do e-mail',
            self::NO_EMAIL => 'Beneficiário sem e-mail válido',
            self::NOT_SENT => 'E-mail não enviado',
            self::UNCONFIRMED => 'Resultado do envio não confirmado',
        };
    }
}
