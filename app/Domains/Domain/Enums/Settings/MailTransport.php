<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Settings;

/**
 * Mecanismos de envio já suportados pela instalação (config/mail.php).
 */
enum MailTransport: string
{
    case SMTP = 'smtp';
    case LOG = 'log';

    public function label(): string
    {
        return match ($this) {
            self::SMTP => 'SMTP',
            self::LOG => 'Registro em log (sem envio real)',
        };
    }
}
