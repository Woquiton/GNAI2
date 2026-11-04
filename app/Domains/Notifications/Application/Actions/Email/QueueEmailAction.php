<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Application\Handlers\Email\EmailQueueHandler;
use App\Domains\Notifications\Domain\DTOs\EmailMessageDTO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

/** Registra primeiro, enfileira depois; falhas de e-mail não revertem a operação de origem. */
final readonly class QueueEmailAction
{
    public function __construct(private EmailQueueHandler $queue) {}

    public function execute(EmailMessageDTO $message): void
    {
        try {
            DB::afterCommit(fn () => $this->queue->enqueue($message));
        } catch (Throwable $exception) {
            Log::warning('Não foi possível preparar o e-mail. A operação de origem foi preservada.', [
                'context_type' => $message->contextType,
                'context_id' => $message->contextId,
                'purpose' => $message->purpose,
                'exception' => $exception,
            ]);
        }
    }
}
