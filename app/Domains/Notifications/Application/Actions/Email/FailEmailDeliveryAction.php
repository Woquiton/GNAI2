<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Notifications\Infrastructure\Mail\EmailDeliveryReceiptStore;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

final class FailEmailDeliveryAction
{
    public function __construct(
        private readonly EmailDeliveryReceiptStore $receipts,
        private readonly RecordEmailResultAction $recordResult,
    ) {}

    public function execute(string $deliveryId, Throwable $exception): void
    {
        try {
            Cache::lock('email-delivery:'.$deliveryId, 60)->block(5, function () use ($deliveryId, $exception): void {
                $receipt = $this->receipts->find($deliveryId);
                if ($receipt !== null) {
                    $this->recordResult->execute($receipt);

                    return;
                }
                EmailDelivery::query()->whereKey($deliveryId)
                    ->where('status', EmailDeliveryStatus::QUEUED->value)
                    ->update(['status' => EmailDeliveryStatus::FAILED->value, 'error_type' => $exception::class]);
                EmailDelivery::query()->whereKey($deliveryId)
                    ->where('status', EmailDeliveryStatus::PROCESSING->value)
                    ->update(['status' => EmailDeliveryStatus::UNCONFIRMED->value, 'error_type' => $exception::class]);
            });
        } catch (Throwable $trackingException) {
            Log::error('Não foi possível registrar a falha definitiva do e-mail.', [
                'email_delivery_id' => $deliveryId,
                'exception' => $trackingException,
            ]);
        }
        Log::warning('Falha no processamento de e-mail após as tentativas da fila.', [
            'email_delivery_id' => $deliveryId,
            'exception' => $exception,
        ]);
    }
}
