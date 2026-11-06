<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Notifications\Email;

use App\Domains\Domain\DTOs\Notifications\EmailDeliveryReceiptDTO;
use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use App\Domains\Infrastructure\Mail\Notifications\EmailDeliveryReceiptStore;
use Illuminate\Support\Facades\DB;

final readonly class RecordEmailResultAction
{
    public function __construct(private EmailDeliveryReceiptStore $receipts) {}

    public function execute(EmailDeliveryReceiptDTO $receipt): void
    {
        DB::transaction(function () use ($receipt): void {
            $delivery = EmailDelivery::query()->lockForUpdate()->find($receipt->deliveryId);
            if ($delivery === null) {
                return;
            }
            $attributes = ['sent_at' => $receipt->sentAt, 'message_id' => $receipt->messageId];
            // A recuperação do aceite SMTP nunca desfaz uma rejeição já recebida.
            if ($delivery->status !== EmailDeliveryStatus::BOUNCED) {
                $attributes['status'] = $receipt->status;
                $attributes['error_type'] = null;
            }
            $delivery->update($attributes);
        });
        $this->receipts->forget($receipt->deliveryId);
    }
}
