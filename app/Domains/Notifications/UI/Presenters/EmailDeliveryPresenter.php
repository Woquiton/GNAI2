<?php

declare(strict_types=1);

namespace App\Domains\Notifications\UI\Presenters;

use App\Domains\Notifications\Domain\Enums\EmailDeliveryContext;
use App\Domains\Notifications\Domain\Enums\EmailPurpose;
use App\Domains\Notifications\Domain\Models\EmailDelivery;

final class EmailDeliveryPresenter
{
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
        return [
            'id' => $delivery->id,
            'subject' => $delivery->subject,
            'recipient_name' => $delivery->recipient_name,
            'recipient_email' => $delivery->recipient_email,
            'context_label' => EmailDeliveryContext::tryFrom($delivery->context_type)?->label() ?? 'Outros envios',
            'purpose_label' => EmailPurpose::tryFrom($delivery->purpose)?->label() ?? 'Outro aviso',
            'delivery' => $this->present($delivery),
            'attempts' => $delivery->attempts,
            'created_at_label' => $delivery->created_at?->format('d/m/Y H:i'),
        ];
    }

    public function details(EmailDelivery $delivery): array
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

        return [
            ...$this->record($delivery),
            'last_attempt_at_label' => $delivery->last_attempt_at?->format('d/m/Y H:i'),
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
