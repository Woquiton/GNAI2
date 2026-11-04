<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Domain\DTOs\EmailMessageDTO;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use Throwable;

/** Usa o mesmo registro e transporte da fila, com retorno imediato para diagnóstico. */
final readonly class SendEmailNowAction
{
    public function __construct(
        private RegisterEmailAction $register,
        private SendEmailAction $send,
        private FailEmailDeliveryAction $fail,
    ) {}

    public function execute(EmailMessageDTO $message): EmailDelivery
    {
        $delivery = $this->register->execute($message);
        try {
            $this->send->execute($delivery->id);
        } catch (Throwable $exception) {
            $this->fail->execute($delivery->id, $exception);

            throw $exception;
        }

        return $delivery->refresh();
    }
}
