<?php

declare(strict_types=1);

namespace App\Domains\Application\Handlers\Notifications\Email;

use App\Domains\Application\Actions\Notifications\Email\RegisterEmailAction;
use App\Domains\Domain\DTOs\Notifications\EmailMessageDTO;
use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use App\Domains\Infrastructure\Jobs\Notifications\SendEmailDelivery;
use App\Domains\Application\Queries\Settings\GetAutomaticEmailSettingsQuery;
use App\Domains\Domain\ValueObjects\Settings\AutomaticEmailSettings;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class EmailQueueHandler
{
    public function __construct(
        private RegisterEmailAction $register,
        private GetAutomaticEmailSettingsQuery $automaticEmails,
    ) {}

    public function enqueue(EmailMessageDTO $message): void
    {
        $delivery = null;
        try {
            if (array_key_exists($message->purpose, AutomaticEmailSettings::defaults())
                && ! $this->automaticEmails->execute()->allows($message->purpose)) {
                return;
            }

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
