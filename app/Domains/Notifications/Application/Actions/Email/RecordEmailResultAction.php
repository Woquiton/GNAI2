<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Domain\DTOs\EmailDeliveryReceiptDTO;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Notifications\Infrastructure\Mail\EmailDeliveryReceiptStore;

final class RecordEmailResultAction
{
    public function __construct(private readonly EmailDeliveryReceiptStore $receipts) {}

    public function execute(EmailDeliveryReceiptDTO $receipt): void
    {
        EmailDelivery::query()->whereKey($receipt->deliveryId)->update([
            'status' => $receipt->status->value,
            'sent_at' => $receipt->sentAt,
            'message_id' => $receipt->messageId,
            'error_type' => null,
        ]);
        $this->receipts->forget($receipt->deliveryId);
    }
}
