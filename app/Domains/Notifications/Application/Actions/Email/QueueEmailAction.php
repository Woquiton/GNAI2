<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Domain\DTOs\EmailMessageDTO;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Notifications\Infrastructure\Jobs\SendEmailDelivery;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

/** Registra primeiro, enfileira depois; falhas de e-mail não revertem a operação de origem. */
final class QueueEmailAction
{
    public function execute(EmailMessageDTO $message): void
    {
        try {
            DB::afterCommit(fn () => $this->queue($message));
        } catch (Throwable $exception) {
            $this->logFailure($message, $exception);
        }
    }

    private function queue(EmailMessageDTO $message): void
    {
        $delivery = null;
        try {
            $email = trim((string) $message->recipientEmail);
            $valid = filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
            $delivery = EmailDelivery::query()->firstOrCreate(
                ['deduplication_key' => hash('sha256', $message->deduplicationKey)],
                [
                    'context_type' => $message->contextType,
                    'context_id' => $message->contextId,
                    'purpose' => $message->purpose,
                    'recipient_email' => $email ?: null,
                    'recipient_name' => $message->recipientName,
                    'subject' => $message->subject,
                    'view' => $message->view,
                    'text_view' => $message->textView,
                    'payload' => $message->payload,
                    'status' => $valid ? EmailDeliveryStatus::QUEUED : EmailDeliveryStatus::NO_EMAIL,
                ],
            );
            if (! $delivery->wasRecentlyCreated || ! $valid) {
                return;
            }
            Bus::dispatch(new SendEmailDelivery($delivery->id));
        } catch (Throwable $exception) {
            if ($delivery !== null) {
                try {
                    EmailDelivery::query()->whereKey($delivery->id)
                        ->where('status', '!=', EmailDeliveryStatus::SENT->value)
                        ->update(['status' => EmailDeliveryStatus::FAILED->value, 'error_type' => $exception::class]);
                } catch (Throwable) {
                    // O registro principal continua preservado mesmo se o banco estiver indisponível.
                }
            }
            $this->logFailure($message, $exception);
        }
    }

    private function logFailure(EmailMessageDTO $message, Throwable $exception): void
    {
        Log::warning('Não foi possível preparar o e-mail. A operação de origem foi preservada.', [
            'context_type' => $message->contextType,
            'context_id' => $message->contextId,
            'purpose' => $message->purpose,
            'exception' => $exception,
        ]);
    }
}
