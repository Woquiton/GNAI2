<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Handlers\Email;

use App\Domains\Notifications\Application\Actions\Email\RegisterEmailAction;
use App\Domains\Notifications\Domain\DTOs\EmailMessageDTO;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Notifications\Infrastructure\Jobs\SendEmailDelivery;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class EmailQueueHandler
{
    public function __construct(private RegisterEmailAction $register) {}

    public function enqueue(EmailMessageDTO $message): void
    {
        $delivery = null;
        try {
            $delivery = $this->register->execute($message);
            if (! $delivery->wasRecentlyCreated || $delivery->status !== EmailDeliveryStatus::QUEUED) {
                return;
            }
            Bus::dispatch(new SendEmailDelivery($delivery->id));
        } catch (Throwable $exception) {
            if ($delivery !== null) {
                try {
                    EmailDelivery::query()->whereKey($delivery->id)
                        ->whereNotIn('status', [EmailDeliveryStatus::SENT->value, EmailDeliveryStatus::BOUNCED->value])
                        ->update(['status' => EmailDeliveryStatus::FAILED->value, 'error_type' => $exception::class]);
                } catch (Throwable) {
                    // O registro principal continua preservado mesmo se o banco estiver indisponível.
                }
            }
            Log::warning('Não foi possível preparar o e-mail. A operação de origem foi preservada.', [
                'context_type' => $message->contextType,
                'context_id' => $message->contextId,
                'purpose' => $message->purpose,
                'exception' => $exception,
            ]);
        }
    }
}
