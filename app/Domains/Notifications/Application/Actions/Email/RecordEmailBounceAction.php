<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Domain\DTOs\EmailBounceDTO;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use Illuminate\Support\Facades\Cache;

final readonly class RecordEmailBounceAction
{
    public function execute(EmailBounceDTO $bounce): bool
    {
        // Não associar pelo assunto ou somente pelo endereço do destinatário.
        $delivery = EmailDelivery::query()->whereIn('message_id', [
            $bounce->messageId, '<'.$bounce->messageId.'>',
        ])->first();
        if ($delivery === null || strcasecmp((string) $delivery->recipient_email, $bounce->recipient) !== 0) {
            return false;
        }

        return Cache::lock('email-delivery:'.$delivery->id, 60)->block(5, function () use ($delivery, $bounce): bool {
            $delivery->refresh();
            if ($delivery->status === EmailDeliveryStatus::BOUNCED) {
                return true;
            }
            if (! in_array($delivery->status, [
                EmailDeliveryStatus::SENT, EmailDeliveryStatus::PROCESSING, EmailDeliveryStatus::UNCONFIRMED,
            ], true)) {
                return false;
            }
            $delivery->update([
                'status' => EmailDeliveryStatus::BOUNCED,
                'error_type' => 'dsn:'.$bounce->status,
            ]);

            return true;
        });
    }
}
