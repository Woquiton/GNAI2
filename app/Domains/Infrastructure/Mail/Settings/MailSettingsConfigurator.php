<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Mail\Settings;

use App\Domains\Application\Queries\Settings\GetMailSettingsQuery;
use App\Domains\Domain\Enums\Settings\MailTransport;
use App\Domains\Domain\ValueObjects\Settings\MailSettings;
use Illuminate\Contracts\Config\Repository;

/**
 * Aplica as configurações de e-mail cadastradas sobre config/mail.php. Sem
 * cadastro, mantém os valores vindos do .env.
 */
final readonly class MailSettingsConfigurator
{
    public function __construct(
        private Repository $config,
        private GetMailSettingsQuery $mailSettings,
    ) {}

    public function apply(): ?MailSettings
    {
        $settings = $this->mailSettings->execute();

        if (! $settings instanceof MailSettings) {
            return null;
        }

        $this->config->set('mail.default', $settings->transport->value);
        $this->config->set('mail.from', [
            'address' => $settings->fromAddress,
            'name' => $settings->fromName,
        ]);

        if ($settings->transport === MailTransport::SMTP) {
            $this->config->set('mail.mailers.smtp', [
                ...(array) $this->config->get('mail.mailers.smtp', []),
                ...$settings->smtpConfig(),
            ]);
        }

        return $settings;
    }
}
