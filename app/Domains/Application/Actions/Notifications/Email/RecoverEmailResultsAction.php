<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Notifications\Email;

use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use App\Domains\Infrastructure\Mail\Notifications\EmailDeliveryReceiptStore;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

final class RecoverEmailResultsAction
{
    public function __construct(
        private readonly EmailDeliveryReceiptStore $receipts,
        private readonly RecordEmailResultAction $recordResult,
    ) {}

    public function execute(): void
    {
        $pending = $this->receipts->pendingIds();
        $interrupted = EmailDelivery::query()
            ->where('status', EmailDeliveryStatus::PROCESSING->value)
            ->where('last_attempt_at', '<', now()->subMinutes(5))
            ->pluck('id')->all();

        foreach (array_unique([...$pending, ...$interrupted]) as $deliveryId) {
            try {
                Cache::lock('email-delivery:'.$deliveryId, 60)->get(function () use ($deliveryId): void {
                    $receipt = $this->receipts->find($deliveryId);
                    if ($receipt !== null) {
                        $this->recordResult->execute($receipt);

                        return;
                    }
                    // Não confundir interrupção sem resultado com falha confirmada de envio.
                    EmailDelivery::query()->whereKey($deliveryId)
                        ->where('status', EmailDeliveryStatus::PROCESSING->value)
                        ->where('last_attempt_at', '<', now()->subMinutes(5))
                        ->update(['status' => EmailDeliveryStatus::UNCONFIRMED->value]);
                });
            } catch (Throwable $exception) {
                Log::warning('Não foi possível recuperar o resultado do envio de e-mail.', [
                    'email_delivery_id' => $deliveryId,
                    'exception' => $exception,
                ]);
            }
        }
    }
}
