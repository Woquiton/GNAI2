<?php

declare(strict_types=1);

namespace App\Domains\Domain\ValueObjects\Settings;

use App\Domains\Domain\Enums\Settings\MailEncryption;
use App\Domains\Domain\Enums\Settings\MailTestStatus;
use App\Domains\Domain\Enums\Settings\MailTransport;

final readonly class MailSettings
{
    public function __construct(
        public MailTransport $transport,
        public ?string $host,
        public ?int $port,
        public MailEncryption $encryption,
        public ?string $username,
        public ?string $password,
        public string $fromAddress,
        public string $fromName,
        public ?MailTestStatus $testStatus = null,
        public ?string $lastTestedAt = null,
        public bool $gmailBouncesEnabled = false,
        public string $gmailBouncesFolder = 'INBOX',
        public bool $gmailInboxEnabled = false,
        public string $gmailInboxFolder = 'INBOX',
        public bool $gmailFoldersEnabled = false,
    ) {}

    /**
     * @param  array<string, mixed>  $payload
     */
    public static function fromPayload(array $payload, ?string $password): self
    {
        return new self(
            transport: MailTransport::tryFrom((string) ($payload['transport'] ?? '')) ?? MailTransport::SMTP,
            host: self::nullableString($payload['host'] ?? null),
            port: is_numeric($payload['port'] ?? null) ? (int) $payload['port'] : null,
            encryption: MailEncryption::tryFrom((string) ($payload['encryption'] ?? '')) ?? MailEncryption::TLS,
            username: self::nullableString($payload['username'] ?? null),
            password: $password,
            fromAddress: (string) ($payload['from_address'] ?? ''),
            fromName: (string) ($payload['from_name'] ?? ''),
            testStatus: MailTestStatus::tryFrom((string) ($payload['test_status'] ?? '')),
            lastTestedAt: self::nullableString($payload['last_tested_at'] ?? null),
            gmailBouncesEnabled: (bool) ($payload['gmail_bounces_enabled'] ?? false),
            gmailBouncesFolder: (string) ($payload['gmail_bounces_folder'] ?? 'INBOX'),
            gmailInboxEnabled: (bool) ($payload['gmail_inbox_enabled'] ?? false),
            gmailInboxFolder: (string) ($payload['gmail_inbox_folder'] ?? 'INBOX'),
            gmailFoldersEnabled: (bool) ($payload['gmail_folders_enabled'] ?? false),
        );
    }

    /**
     * Valores persistidos sem a senha, que é armazenada criptografada à parte.
     *
     * @return array<string, mixed>
     */
    public function toPayload(): array
    {
        return [
            'transport' => $this->transport->value,
            'host' => $this->host,
            'port' => $this->port,
            'encryption' => $this->encryption->value,
            'username' => $this->username,
            'from_address' => $this->fromAddress,
            'from_name' => $this->fromName,
            'test_status' => $this->testStatus?->value,
            'last_tested_at' => $this->lastTestedAt,
            'gmail_bounces_enabled' => $this->gmailBouncesEnabled,
            'gmail_bounces_folder' => $this->gmailBouncesFolder,
            'gmail_inbox_enabled' => $this->gmailInboxEnabled,
            'gmail_inbox_folder' => $this->gmailInboxFolder,
            'gmail_folders_enabled' => $this->gmailFoldersEnabled,
        ];
    }

    public function monitorsGmailBounces(): bool
    {
        return $this->gmailBouncesEnabled && $this->transport === MailTransport::SMTP
            && strtolower((string) $this->host) === 'smtp.gmail.com';
    }

    public function receivesGmailReplies(): bool
    {
        return $this->gmailInboxEnabled && $this->transport === MailTransport::SMTP
            && strtolower((string) $this->host) === 'smtp.gmail.com';
    }

    public function syncsGmailFolders(): bool
    {
        return $this->gmailFoldersEnabled && $this->transport === MailTransport::SMTP
            && strtolower((string) $this->host) === 'smtp.gmail.com';
    }

    /**
     * Valores que substituem os do mailer SMTP de config/mail.php.
     *
     * @return array<string, mixed>
     */
    public function smtpConfig(): array
    {
        return [
            'transport' => 'smtp',
            'scheme' => $this->encryption->scheme(),
            'url' => null,
            'host' => $this->host,
            'port' => $this->port,
            'username' => $this->username,
            'password' => $this->password,
            ...$this->encryption->transportOptions(),
        ];
    }

    private static function nullableString(mixed $value): ?string
    {
        $value = is_string($value) ? trim($value) : null;

        return $value === null || $value === '' ? null : $value;
    }
}
