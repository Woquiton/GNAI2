<?php

declare(strict_types=1);

namespace App\Domains\Application\Rules\Settings;

use App\Domains\Infrastructure\Mail\Notifications\GmailImapClient;
use App\Domains\Domain\Enums\Settings\MailTransport;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;

final class GmailMailboxAvailable implements DataAwareRule, ValidationRule
{
    private array $data = [];

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! filter_var($value, FILTER_VALIDATE_BOOLEAN)) {
            return;
        }

        $host = $this->data['host'] ?? null;
        if (($this->data['transport'] ?? null) !== MailTransport::SMTP->value || ! is_string($host)
            || strtolower(trim($host)) !== 'smtp.gmail.com') {
            $fail('A leitura de e-mails exige o servidor Gmail / Google Workspace.');

            return;
        }

        if ($attribute === 'gmail_folders_enabled') {
            if (! GmailImapClient::available()) {
                $fail('O servidor precisa de PHP cURL com suporte a IMAPS para sincronizar as pastas.');
            }

            return;
        }
        if (! extension_loaded('imap')) {
            $fail('O servidor precisa da extensão PHP IMAP para habilitar o monitoramento. Solicite ao responsável pela instalação.');
        }
    }
}
