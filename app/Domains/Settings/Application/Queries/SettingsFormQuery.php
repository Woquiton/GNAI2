<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Queries;

use App\Domains\Notifications\Domain\Enums\EmailPurpose;
use App\Domains\Notifications\Infrastructure\Mail\GmailImapClient;
use App\Domains\Settings\Domain\Enums\BackupRetentionMode;
use App\Domains\Settings\Domain\Enums\MailEncryption;
use App\Domains\Settings\Domain\Enums\MailTransport;
use App\Domains\Settings\Domain\Enums\PdfLogoShape;
use App\Domains\Settings\Domain\ValueObjects\BackupSettings;
use App\Domains\Settings\Domain\ValueObjects\MailSettings;
use App\Domains\Settings\Infrastructure\Storage\PdfHeaderLogoStorage;
use Illuminate\Support\Collection;

final readonly class SettingsFormQuery
{
    public function __construct(
        private GetMailSettingsQuery $mailSettings,
        private GetBackupSettingsQuery $backupSettings,
        private GetPdfHeaderSettingsQuery $pdfHeaderSettings,
        private PdfHeaderLogoStorage $pdfLogoStorage,
        private GetAutomaticEmailSettingsQuery $automaticEmails,
    ) {}

    /**
     * A senha nunca é enviada à interface: apenas se existe uma cadastrada.
     *
     * @return array<string, mixed>
     */
    public function forMail(): array
    {
        $settings = $this->mailSettings->execute();
        $configured = $settings instanceof MailSettings;
        $settings ??= $this->environmentMailSettings();

        return [
            'configured' => $configured,
            'mail' => [
                ...$settings->toPayload(),
                'has_password' => $configured && filled($settings->password),
                'has_application_key' => $configured
                    ? filled($settings->password)
                    : filled(config('mail.mailers.smtp.password')),
            ],
            'transports' => $this->options(MailTransport::cases()),
            'encryptions' => $this->options(MailEncryption::cases()),
            'gmailBouncesAvailable' => extension_loaded('imap'),
            'gmailFoldersAvailable' => GmailImapClient::available(),
        ];
    }

    /** @return array<string, mixed> */
    public function forAutomaticEmails(): array
    {
        $groups = [
            'Agendamentos' => [
                EmailPurpose::SESSION_CREATED,
                EmailPurpose::SESSION_UPDATED,
                EmailPurpose::SESSION_CANCELLED,
                EmailPurpose::SESSION_DELETED,
            ],
            'Empréstimos' => [EmailPurpose::LOAN_CONFIRMATION, EmailPurpose::LOAN_RETURNED],
            'Fila de espera' => [EmailPurpose::WAITLIST_REGISTERED, EmailPurpose::WAITLIST_AVAILABLE],
        ];

        return [
            'events' => $this->automaticEmails->execute()->events,
            'groups' => collect($groups)->map(fn (array $purposes, string $label): array => [
                'label' => $label,
                'options' => array_map(fn (EmailPurpose $purpose): array => [
                    'value' => $purpose->value,
                    'label' => $purpose->label(),
                ], $purposes),
            ])->values(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function forBackup(): array
    {
        return [
            'backup' => $this->backupSettings->execute()->toPayload(),
            'defaults' => BackupSettings::defaults()->toPayload(),
            'retentionModes' => $this->options(BackupRetentionMode::cases()),
            'timezone' => (string) config('app.timezone'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function forPdf(): array
    {
        $settings = $this->pdfHeaderSettings->execute();

        return [
            'pdfHeader' => [
                'institution_name' => $settings->institutionName,
                'issuing_unit' => $settings->issuingUnit,
                'details' => $settings->details,
                'logo_url' => $this->pdfLogoStorage->url($settings),
                'logo_shape' => $settings->logoShape->value,
            ],
            'logoShapes' => $this->options(PdfLogoShape::cases()),
        ];
    }

    /**
     * Valores atuais do .env, usados apenas para pré-preencher o primeiro cadastro.
     */
    private function environmentMailSettings(): MailSettings
    {
        $smtp = (array) config('mail.mailers.smtp', []);
        $port = is_numeric($smtp['port'] ?? null) ? (int) $smtp['port'] : null;

        return MailSettings::fromPayload([
            'transport' => config('mail.default'),
            'host' => $smtp['host'] ?? null,
            'port' => $port,
            'encryption' => ($smtp['scheme'] ?? null) === 'smtps' || $port === 465
                ? MailEncryption::SSL->value
                : MailEncryption::TLS->value,
            'username' => $smtp['username'] ?? null,
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
        ], null);
    }

    /**
     * @param  list<MailTransport|MailEncryption|BackupRetentionMode|PdfLogoShape>  $cases
     * @return Collection<string, string>
     */
    private function options(array $cases): Collection
    {
        return collect($cases)->mapWithKeys(
            static fn (MailTransport|MailEncryption|BackupRetentionMode|PdfLogoShape $case): array => [
                $case->value => $case->label(),
            ],
        );
    }
}
