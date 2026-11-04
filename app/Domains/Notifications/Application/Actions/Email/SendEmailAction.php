<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Domain\DTOs\EmailDeliveryReceiptDTO;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Notifications\Infrastructure\Mail\EmailDeliveryReceiptStore;
use App\Domains\Notifications\Infrastructure\Mail\TransactionalEmail;
use App\Domains\Settings\Infrastructure\Mail\MailSettingsConfigurator;
use Illuminate\Mail\Transport\ArrayTransport;
use Illuminate\Mail\Transport\LogTransport;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mime\Email;
use Throwable;

final readonly class SendEmailAction
{
    public function __construct(
        private EmailDeliveryReceiptStore $receipts,
        private RecordEmailResultAction $recordResult,
        private MailSettingsConfigurator $mailSettings,
    ) {}

    public function execute(string $deliveryId): void
    {
        Cache::lock('email-delivery:'.$deliveryId, 60)->block(5, function () use ($deliveryId): void {
            // Uma nova execução recupera o resultado pendente sem chamar o transporte novamente.
            $receipt = $this->receipts->find($deliveryId);
            if ($receipt !== null) {
                $this->recordResult->execute($receipt);

                return;
            }
            $delivery = EmailDelivery::query()->find($deliveryId);
            if ($delivery === null || in_array($delivery->status, [
                EmailDeliveryStatus::SENT,
                EmailDeliveryStatus::BOUNCED,
                EmailDeliveryStatus::NO_EMAIL,
                EmailDeliveryStatus::NOT_SENT,
                EmailDeliveryStatus::FAILED,
                EmailDeliveryStatus::UNCONFIRMED,
            ], true)) {
                return;
            }
            if ($delivery->status === EmailDeliveryStatus::PROCESSING) {
                // O worker anterior pode ter parado depois do aceite pelo transporte.
                $delivery->update(['status' => EmailDeliveryStatus::UNCONFIRMED]);

                return;
            }
            $delivery->update([
                'status' => EmailDeliveryStatus::PROCESSING,
                'attempts' => $delivery->attempts + 1,
                'last_attempt_at' => now(),
                'error_type' => null,
            ]);
            try {
                Mail::getFacadeRoot();
                $this->mailSettings->apply();
                Mail::purge();
                $mailer = Mail::mailer();
                $transport = $mailer->getSymfonyTransport();
                $realDelivery = ! ($transport instanceof LogTransport || $transport instanceof ArrayTransport);
                $domain = substr(strrchr((string) config('mail.from.address'), '@') ?: '@gnai.local', 1);
                $messageId = $delivery->id.'@'.$domain;
                // Persistir antes do transporte permite correlacionar até uma rejeição imediata.
                $delivery->update(['message_id' => $messageId]);
                $email = new TransactionalEmail(
                    $delivery->subject, $delivery->view, $delivery->text_view, $delivery->payload,
                );
                $email->withSymfonyMessage(function (Email $message) use ($messageId): void {
                    $message->getHeaders()->removeAll('Message-ID');
                    $message->getHeaders()->addIdHeader('Message-ID', $messageId);
                });
                $message = $mailer->to($delivery->recipient_email, $delivery->recipient_name)->sendNow($email);
            } catch (Throwable $exception) {
                try {
                    $delivery->update([
                        'status' => EmailDeliveryStatus::QUEUED,
                        'error_type' => $exception::class,
                    ]);
                } catch (Throwable $trackingException) {
                    Log::warning('Não foi possível registrar a tentativa de envio.', [
                        'email_delivery_id' => $deliveryId,
                        'exception' => $trackingException,
                    ]);
                }
                throw $exception;
            }
            // SMTP já aceitou a mensagem: falha de rastreamento não deve provocar outro envio.
            $sent = $realDelivery && $message !== null;
            $receipt = new EmailDeliveryReceiptDTO(
                $deliveryId,
                $sent ? EmailDeliveryStatus::SENT : EmailDeliveryStatus::NOT_SENT,
                $sent ? now()->toDateTimeString() : null,
                $sent ? $message->getMessageId() : null,
            );
            try {
                $this->receipts->put($receipt);
            } catch (Throwable $exception) {
                Log::error('Não foi possível guardar o resultado para recuperação do rastreamento.', [
                    'email_delivery_id' => $deliveryId,
                    'exception' => $exception,
                ]);
            }
            try {
                $this->recordResult->execute($receipt);
            } catch (Throwable $exception) {
                Log::error('E-mail processado, mas não foi possível atualizar seu rastreamento.', [
                    'email_delivery_id' => $deliveryId,
                    'exception' => $exception,
                ]);
            }
        });
    }
}
