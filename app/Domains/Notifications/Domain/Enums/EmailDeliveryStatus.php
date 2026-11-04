<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Domain\Enums;

enum EmailDeliveryStatus: string
{
    case QUEUED = 'queued';
    case DRAFT = 'draft';
    case RECEIVED = 'received';
    case PROCESSING = 'processing';
    case SENT = 'sent';
    case BOUNCED = 'bounced';
    case FAILED = 'failed';
    case NO_EMAIL = 'no_email';
    case NOT_SENT = 'not_sent';
    case UNCONFIRMED = 'unconfirmed';

    public function label(): string
    {
        return match ($this) {
            self::QUEUED => 'E-mail na fila',
            self::DRAFT => 'Rascunho',
            self::RECEIVED => 'Resposta recebida',
            self::PROCESSING => 'Enviando e-mail',
            self::SENT => 'Aceito pelo servidor de envio',
            self::BOUNCED => 'E-mail não entregue',
            self::FAILED => 'Falha no envio do e-mail',
            self::NO_EMAIL => 'Beneficiário sem e-mail válido',
            self::NOT_SENT => 'E-mail não enviado',
            self::UNCONFIRMED => 'Resultado do envio não confirmado',
        };
    }
}
