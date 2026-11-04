<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Data;

use App\Domains\Settings\Application\Queries\GetMailSettingsQuery;
use App\Domains\Settings\Application\Rules\GmailMailboxAvailable;
use App\Domains\Settings\Domain\Enums\MailEncryption;
use App\Domains\Settings\Domain\Enums\MailTransport;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class UpdateMailSettingsData extends Data
{
    public function __construct(
        public MailTransport $transport,
        public MailEncryption $encryption,
        public string $fromAddress,
        public string $fromName,
        public ?string $host = null,
        public ?int $port = null,
        public ?string $username = null,
        public ?string $password = null,
        public bool $gmailBouncesEnabled = false,
        public string $gmailBouncesFolder = 'INBOX',
        public bool $gmailInboxEnabled = false,
        public string $gmailInboxFolder = 'INBOX',
        public bool $gmailFoldersEnabled = false,
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        foreach (['host', 'username', 'from_address', 'from_name', 'gmail_bounces_folder', 'gmail_inbox_folder'] as $field) {
            if (array_key_exists($field, $properties) && is_string($properties[$field])) {
                $properties[$field] = trim($properties[$field]) === '' ? null : trim($properties[$field]);
            }
        }

        if (! filter_var($properties['gmail_bounces_enabled'] ?? false, FILTER_VALIDATE_BOOLEAN)
            && ($properties['gmail_bounces_folder'] ?? null) === null) {
            $properties['gmail_bounces_folder'] = 'INBOX';
        }
        if (! filter_var($properties['gmail_inbox_enabled'] ?? false, FILTER_VALIDATE_BOOLEAN)
            && ($properties['gmail_inbox_folder'] ?? null) === null) {
            $properties['gmail_inbox_folder'] = 'INBOX';
        }

        if (array_key_exists('password', $properties) && $properties['password'] === '') {
            $properties['password'] = null;
        }

        if (array_key_exists('port', $properties)) {
            $properties['port'] = is_numeric($properties['port']) ? (int) $properties['port'] : null;
        }

        return $properties;
    }

    public static function rules(): array
    {
        return [
            'transport' => ['required', Rule::enum(MailTransport::class)],
            'host' => ['nullable', 'required_if:transport,smtp', 'string', 'max:255'],
            'port' => ['nullable', 'required_if:transport,smtp', 'integer', 'between:1,65535'],
            'encryption' => ['required', Rule::enum(MailEncryption::class)],
            'username' => [
                'nullable',
                'required_if:transport,smtp',
                'string',
                'max:255',
                Rule::when(request()->boolean('gmail_bounces_enabled') || request()->boolean('gmail_inbox_enabled') || request()->boolean('gmail_folders_enabled'), ['email:rfc']),
            ],
            'password' => [
                'nullable',
                Rule::requiredIf(static function (): bool {
                    if (request()->input('transport') !== MailTransport::SMTP->value) {
                        return false;
                    }

                    return ! filled(app(GetMailSettingsQuery::class)->execute()?->password);
                }),
                'string',
                'max:255',
            ],
            'from_address' => ['required', 'string', 'email:rfc', 'max:255'],
            'from_name' => ['required', 'string', 'max:255'],
            'gmail_bounces_enabled' => [
                'sometimes',
                'boolean',
                new GmailMailboxAvailable,
            ],
            'gmail_bounces_folder' => ['sometimes', 'required', 'string', 'max:255', 'not_regex:/[{}\r\n]/'],
            'gmail_inbox_enabled' => ['sometimes', 'boolean', new GmailMailboxAvailable],
            'gmail_folders_enabled' => ['sometimes', 'boolean', new GmailMailboxAvailable],
            'gmail_inbox_folder' => ['sometimes', 'required', 'string', 'max:255', 'not_regex:/[{}\r\n]/'],
        ];
    }

    public static function messages(): array
    {
        return [
            'transport.required' => 'Informe o tipo de envio.',
            'transport.enum' => 'O tipo de envio selecionado é inválido.',
            'host.required_if' => 'Informe o servidor SMTP.',
            'host.max' => 'O servidor SMTP não pode ultrapassar 255 caracteres.',
            'port.required_if' => 'Informe a porta do servidor SMTP.',
            'port.integer' => 'A porta deve ser um número inteiro.',
            'port.between' => 'A porta deve estar entre 1 e 65535.',
            'encryption.required' => 'Informe o tipo de segurança da conexão.',
            'encryption.enum' => 'O tipo de segurança selecionado é inválido.',
            'username.required_if' => 'Informe o usuário de autenticação da conta SMTP.',
            'username.max' => 'O usuário de autenticação não pode ultrapassar 255 caracteres.',
            'password.required' => 'Informe a chave de aplicativo.',
            'password.max' => 'A chave de aplicativo não pode ultrapassar 255 caracteres.',
            'from_address.required' => 'Informe o e-mail de envio.',
            'from_address.email' => 'Informe um e-mail de envio válido.',
            'from_address.max' => 'O e-mail de envio não pode ultrapassar 255 caracteres.',
            'from_name.required' => 'Informe o nome do remetente.',
            'from_name.max' => 'O nome do remetente não pode ultrapassar 255 caracteres.',
            'gmail_bounces_enabled.boolean' => 'Informe se deseja monitorar as rejeições do Gmail.',
            'gmail_bounces_folder.required' => 'Informe a pasta do Gmail que recebe os avisos de rejeição.',
            'gmail_bounces_folder.string' => 'Informe uma pasta válida do Gmail.',
            'gmail_bounces_folder.max' => 'A pasta do Gmail não pode ultrapassar 255 caracteres.',
            'gmail_bounces_folder.not_regex' => 'A pasta do Gmail não pode conter chaves ou quebras de linha.',
            'gmail_inbox_enabled.boolean' => 'Informe se deseja receber respostas do Gmail.',
            'gmail_folders_enabled.boolean' => 'Informe se deseja sincronizar pastas com o Gmail.',
            'gmail_inbox_folder.required' => 'Informe a pasta do Gmail que recebe as respostas.',
            'gmail_inbox_folder.max' => 'A pasta do Gmail não pode ultrapassar 255 caracteres.',
            'gmail_inbox_folder.not_regex' => 'A pasta do Gmail não pode conter chaves ou quebras de linha.',
            'username.email' => 'Informe o endereço completo da conta Gmail para ler os e-mails.',
        ];
    }
}
