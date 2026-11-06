<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Notifications\Email;

use App\Domains\Application\Rules\Notifications\EmailAddressList;
use App\Domains\Application\Rules\Notifications\EmailBodyContent;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Support\Validation\ValidationContext;

#[MapInputName(SnakeCaseMapper::class)]
final class ComposeEmailData extends Data
{
    public function __construct(
        public string $key,
        public string $intent,
        public ?string $to = null,
        public ?string $cc = null,
        public ?string $bcc = null,
        public ?string $subject = null,
        public ?string $body = null,
        public array $attachments = [],
        public array $removedAttachments = [],
        public ?string $sourceId = null,
        public ?string $replyMode = null,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        $sending = ($context->payload['intent'] ?? '') === 'send';

        return [
            'key' => ['required', 'uuid'],
            'intent' => ['required', Rule::in(['draft', 'send'])],
            'to' => [Rule::requiredIf($sending), 'nullable', 'string', 'max:4000', new EmailAddressList(required: $sending)],
            'cc' => ['nullable', 'string', 'max:4000', new EmailAddressList],
            'bcc' => ['nullable', 'string', 'max:4000', new EmailAddressList],
            'subject' => [Rule::requiredIf($sending), 'nullable', 'string', 'max:255', 'not_regex:/[\r\n]/'],
            'body' => [Rule::requiredIf($sending), 'nullable', 'string', 'max:100000', ...($sending ? [new EmailBodyContent] : [])],
            'attachments' => ['array', 'max:5'],
            'attachments.*' => ['file', 'max:5120', 'mimes:pdf,txt,csv,png,jpg,jpeg,gif,webp,doc,docx,xls,xlsx,ppt,pptx,odt,ods,zip'],
            'removed_attachments' => ['array', 'max:5'],
            'removed_attachments.*' => ['integer', 'min:0', 'max:4'],
            'source_id' => ['nullable', 'uuid', 'exists:email_deliveries,id'],
            'reply_mode' => ['nullable', Rule::in(['reply', 'forward'])],
        ];
    }

    public static function messages(): array
    {
        return [
            'to.required' => 'Informe pelo menos um destinatário.',
            'subject.required' => 'Informe o assunto.',
            'subject.max' => 'O assunto deve ter até 255 caracteres.',
            'subject.not_regex' => 'O assunto não pode conter quebras de linha.',
            'body.required' => 'Escreva a mensagem.',
            'body.max' => 'A mensagem deve ter até 100 mil caracteres.',
            'attachments.max' => 'Anexe no máximo cinco arquivos.',
            'attachments.*.max' => 'Cada anexo deve ter até 5 MB.',
            'attachments.*.mimes' => 'Use imagens, documentos, planilhas, apresentações ou arquivos ZIP.',
        ];
    }
}
