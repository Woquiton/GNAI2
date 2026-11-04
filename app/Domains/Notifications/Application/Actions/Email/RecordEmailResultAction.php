<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Domain\DTOs\EmailDeliveryReceiptDTO;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Notifications\Infrastructure\Mail\EmailDeliveryReceiptStore;
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
