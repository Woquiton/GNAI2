<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Domain\DTOs\EmailMessageDTO;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Models\EmailDelivery;

/** Registro comum aos envios pela fila e aos envios imediatos. */
final class RegisterEmailAction
{
    public function execute(EmailMessageDTO $message): EmailDelivery
    {
        $email = trim((string) $message->recipientEmail);
        $valid = filter_var($email, FILTER_VALIDATE_EMAIL) !== false;

        return EmailDelivery::query()->firstOrCreate(
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
    }
}
