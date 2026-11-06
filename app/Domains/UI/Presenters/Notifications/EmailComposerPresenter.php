<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Notifications;

use App\Domains\Application\Data\Notifications\Email\OpenEmailComposerData;
use App\Domains\Application\Policies\Notifications\EmailMailboxAccessPolicy;
use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Enums\Notifications\EmailPurpose;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use App\Domains\Application\Queries\Settings\GetMailSettingsQuery;
use Illuminate\Support\Str;

final readonly class EmailComposerPresenter
{
    public function __construct(
        private EmailMailboxAccessPolicy $access,
        private EmailDeliveryPresenter $presenter,
        private GetMailSettingsQuery $settings,
    ) {}

    public function execute(OpenEmailComposerData $data, int $userId): array
    {
        $sender = $this->settings->execute();
        $values = [
            'key' => (string) Str::uuid(), 'to' => '', 'cc' => '', 'bcc' => '',
            'subject' => '', 'body' => '', 'attachments' => [], 'draft_id' => null,
            'sender' => $sender?->fromAddress ?? config('mail.from.address'),
            'source_id' => null, 'reply_mode' => null,
        ];
        if ($data->draft !== null) {
            $email = EmailDelivery::query()->findOrFail($data->draft);
            $this->access->ensureCanView($email, $userId);
            abort_unless($email->status === EmailDeliveryStatus::DRAFT && $email->purpose === EmailPurpose::MANUAL->value, 409);
            $payload = $email->payload;

            return [
                ...$values, 'key' => $payload['key'], 'draft_id' => $email->id,
                'to' => implode(', ', $payload['to'] ?? []),
                'cc' => implode(', ', $payload['cc'] ?? []),
                'bcc' => implode(', ', $payload['bcc'] ?? []),
                'subject' => $email->subject, 'body' => $payload['body'] ?? '',
                'source_id' => $payload['source_id'] ?? null, 'reply_mode' => $payload['reply_mode'] ?? null,
                'attachments' => $this->presenter->details($email, $userId)['attachments'],
            ];
        }
        if ($data->source !== null) {
            $email = EmailDelivery::query()->findOrFail($data->source);
            $this->access->ensureCanUseAsSource($email, $userId);
            $details = $this->presenter->details($email, $userId);
            $content = $details['content'];
            $body = $details['body_html'];
            if ($body === null) {
                $lines = array_filter([$content['greeting'], ...$content['paragraphs']]);
                foreach ($content['rows'] as $row) {
                    $lines[] = $row['label'].': '.$row['value'];
                }
                $lines[] = $content['outro'];
                $body = '<p>'.nl2br(e(implode("\n\n", array_filter($lines)))).'</p>';
            }
            $prefix = $data->mode === 'reply' ? 'Re: ' : 'Enc: ';
            $recipients = $details['to'];
            if ($email->purpose === EmailPurpose::INCOMING->value) {
                $recipients = $email->payload['reply_to'] ?? [];
                if ($recipients === []) {
                    $recipients = array_filter([$details['sender_address']]);
                }
            }

            return [
                ...$values,
                'to' => $data->mode === 'reply' ? implode(', ', $recipients) : '',
                'subject' => mb_substr($prefix.$email->subject, 0, 255),
                'source_id' => $email->id, 'reply_mode' => $data->mode,
                'attachments' => $data->mode === 'forward' ? $details['attachments'] : [],
                'body' => '<p><br></p><blockquote><p>'.e($email->subject).'</p>'.$body.'</blockquote>',
            ];
        }

        return $values;
    }
}
