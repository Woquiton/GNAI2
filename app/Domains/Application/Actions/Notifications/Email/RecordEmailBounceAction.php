<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Notifications\Email;

use App\Domains\Domain\DTOs\Notifications\EmailBounceDTO;
use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Enums\Notifications\EmailPurpose;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use Illuminate\Support\Facades\Cache;

final readonly class RecordEmailBounceAction
{
    public function execute(EmailBounceDTO $bounce): bool
    {
        // Não associar pelo assunto ou somente pelo endereço do destinatário.
        $delivery = EmailDelivery::query()->whereIn('message_id', [
            $bounce->messageId, '<'.$bounce->messageId.'>',
        ])->where('purpose', '!=', EmailPurpose::INCOMING->value)->first();
        if ($delivery === null) {
            return false;
        }
        $recipients = [(string) $delivery->recipient_email];
        if ($delivery->purpose === EmailPurpose::MANUAL->value) {
            $recipients = [...$recipients, ...($delivery->payload['to'] ?? []),
                ...($delivery->payload['cc'] ?? []), ...($delivery->payload['bcc'] ?? [])];
        }
        if (! in_array(strtolower($bounce->recipient), array_map('strtolower', $recipients), true)) {
            return false;
        }

        return Cache::lock('email-delivery:'.$delivery->id, 60)->block(5, function () use ($delivery, $bounce): bool {
            $delivery->refresh();
            if (! in_array($delivery->status, [
                EmailDeliveryStatus::SENT, EmailDeliveryStatus::PROCESSING, EmailDeliveryStatus::UNCONFIRMED,
                EmailDeliveryStatus::BOUNCED,
            ], true)) {
                return false;
            }
            $attributes = [
                'status' => EmailDeliveryStatus::BOUNCED,
                'error_type' => 'dsn:'.$bounce->status,
            ];
            if ($delivery->purpose === EmailPurpose::MANUAL->value) {
                $payload = $delivery->payload;
                $payload['rejections'][strtolower($bounce->recipient)] = $bounce->status;
                $attributes['payload'] = $payload;
            }
            $delivery->update($attributes);

            return true;
        });
    }
}
