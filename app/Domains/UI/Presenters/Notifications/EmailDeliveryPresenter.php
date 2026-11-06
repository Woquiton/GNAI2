<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Notifications;

use App\Domains\Domain\Enums\Notifications\EmailDeliveryContext;
use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Enums\Notifications\EmailPurpose;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use App\Domains\Application\Queries\Settings\GetMailSettingsQuery;
use App\Shared\Infrastructure\Security\RichTextSanitizer;

final class EmailDeliveryPresenter
{
    private readonly ?string $gmailAccountHash;

    public function __construct(GetMailSettingsQuery $settings)
    {
        $mail = $settings->execute();
        $this->gmailAccountHash = ($mail?->syncsGmailFolders() ?? false)
            ? hash('sha256', strtolower((string) $mail->username)) : null;
    }

    public function present(?EmailDelivery $delivery): array
    {
        return [
            'status' => $delivery?->status->value ?? 'not_requested',
            'label' => $delivery?->status->label() ?? 'Sem registro de envio',
            'sent_at_label' => $delivery?->sent_at?->format('d/m/Y H:i'),
        ];
    }

    public function record(EmailDelivery $delivery): array
    {
        $state = $delivery->relationLoaded('mailboxStates') ? $delivery->mailboxStates->first() : null;
        $tag = $state?->tag;
        $payload = $delivery->payload ?? [];
        $incoming = $delivery->status === EmailDeliveryStatus::RECEIVED;
        $sharedFolder = $this->gmailAccountHash !== null && $delivery->gmail_account_hash === $this->gmailAccountHash
            && $delivery->gmail_message_id !== null;
        $paragraphs = $payload['paragraphs'] ?? [$payload['intro'] ?? ''];
        $preview = in_array($delivery->purpose, [EmailPurpose::MANUAL->value, EmailPurpose::INCOMING->value], true) ? ($payload['body'] ?? '')
            : implode(' ', array_filter(is_array($paragraphs) ? $paragraphs : [], 'is_string'));

        return [
            'id' => $delivery->id,
            'subject' => $delivery->subject,
            'recipient_name' => $delivery->recipient_name,
            'recipient_email' => $delivery->recipient_email,
            'context_label' => EmailDeliveryContext::tryFrom($delivery->context_type)?->label() ?? 'Outros envios',
            'purpose_label' => EmailPurpose::tryFrom($delivery->purpose)?->label() ?? 'Outro aviso',
            'delivery' => $this->present($delivery),
            'attempts' => $delivery->attempts,
            'created_at_label' => ($delivery->received_at ?? $delivery->created_at)?->format('d/m/Y H:i'),
            'direction' => $incoming ? 'incoming' : 'outgoing',
            'correspondent_name' => $incoming ? ($payload['sender_name'] ?? null) : $delivery->recipient_name,
            'correspondent_email' => $incoming ? ($payload['sender_address'] ?? null) : $delivery->recipient_email,
            'preview' => mb_substr(trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags($preview), ENT_QUOTES, 'UTF-8'))), 0, 180),
            'starred' => $state?->starred ?? false,
            'is_read' => $state?->is_read ?? ! $incoming,
            'folder' => $sharedFolder ? $delivery->gmail_folder : $state?->folder,
            'folder_sync' => $sharedFolder ? 'gmail' : 'local',
            'label' => $tag !== null ? (string) $tag->id : null,
            'label_label' => $tag?->name,
            'label_color' => $tag?->color,
            'has_attachments' => in_array($delivery->purpose, [EmailPurpose::MANUAL->value, EmailPurpose::INCOMING->value], true) && ! empty($payload['attachments']),
        ];
    }

    public function details(EmailDelivery $delivery, ?int $userId = null): array
    {
        $payload = $delivery->payload ?? [];
        $paragraphs = $payload['paragraphs'] ?? [$payload['intro'] ?? ''];
        $rows = $payload['details'] ?? $payload['rows'] ?? [];
        $paragraphs = is_array($paragraphs) ? $paragraphs : [];
        $rows = is_array($rows) ? $rows : [];
        $greeting = $payload['greeting'] ?? null;
        if (! is_string($greeting) && is_string($payload['beneficiaryName'] ?? null)) {
            $greeting = 'Olá, '.$payload['beneficiaryName'].'.';
        }
        $bounceStatus = null;
        if ($delivery->status === EmailDeliveryStatus::BOUNCED
            && preg_match('/^dsn:(5\.\d{1,3}\.\d{1,3})$/D', (string) $delivery->error_type, $match)) {
            $bounceStatus = $match[1];
        }
        $rejections = [];
        if ($delivery->purpose === EmailPurpose::MANUAL->value) {
            $visibleRecipients = array_map('strtolower', [...($payload['to'] ?? []), ...($payload['cc'] ?? [])]);
            foreach ($payload['rejections'] ?? [] as $recipient => $code) {
                if ((int) $delivery->context_id === $userId || in_array($recipient, $visibleRecipients, true)) {
                    $rejections[] = ['recipient' => $recipient, 'code' => $code];
                }
            }
        }

        return [
            ...$this->record($delivery),
            'last_attempt_at_label' => $delivery->last_attempt_at?->format('d/m/Y H:i'),
            'bounce_status' => $bounceStatus,
            'rejections' => $rejections,
            'sender_name' => $payload['sender_name'] ?? null,
            'sender_address' => $payload['sender_address'] ?? null,
            'to' => in_array($delivery->purpose, [EmailPurpose::MANUAL->value, EmailPurpose::INCOMING->value], true) ? ($payload['to'] ?? []) : array_filter([$delivery->recipient_email]),
            'cc' => in_array($delivery->purpose, [EmailPurpose::MANUAL->value, EmailPurpose::INCOMING->value], true) ? ($payload['cc'] ?? []) : [],
            'bcc' => $delivery->purpose === EmailPurpose::MANUAL->value && (int) $delivery->context_id === $userId ? ($payload['bcc'] ?? []) : [],
            'body_html' => in_array($delivery->purpose, [EmailPurpose::MANUAL->value, EmailPurpose::INCOMING->value], true) ? RichTextSanitizer::sanitize($payload['body'] ?? '') : null,
            'notices' => $payload['notices'] ?? [],
            'in_reply_to' => $delivery->relationLoaded('inReplyTo') && $delivery->inReplyTo !== null
                ? ['id' => $delivery->inReplyTo->id, 'subject' => $delivery->inReplyTo->subject] : null,
            'attachments' => in_array($delivery->purpose, [EmailPurpose::MANUAL->value, EmailPurpose::INCOMING->value], true) ? array_map(
                static fn (array $file, int $index): array => [
                    'index' => $index, 'name' => $file['name'], 'size' => $file['size'],
                    'url' => route('emails.attachments.show', [$delivery, $index]),
                ], $payload['attachments'] ?? [], array_keys($payload['attachments'] ?? []),
            ) : [],
            // Não expor o payload inteiro: os avisos de autenticação contêm tokens de acesso.
            'content' => [
                'greeting' => is_string($greeting) ? $greeting : null,
                'paragraphs' => array_values(array_filter($paragraphs, 'is_string')),
                'rows' => array_values(array_map(
                    static fn (array $row): array => [
                        'label' => (string) $row['label'],
                        'value' => (string) $row['value'],
                    ],
                    array_filter($rows, static fn ($row): bool => is_array($row)
                        && is_scalar($row['label'] ?? null)
                        && is_scalar($row['value'] ?? null)),
                )),
                'outro' => is_string($payload['outro'] ?? null) ? $payload['outro'] : null,
                'links_omitted' => filled($payload['actionUrl'] ?? null),
            ],
        ];
    }
}
