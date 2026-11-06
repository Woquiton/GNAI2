<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Jobs\Notifications;

use App\Domains\Application\Actions\Notifications\Email\FailEmailDeliveryAction;
use App\Domains\Application\Actions\Notifications\Email\SendEmailAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use LogicException;
use Throwable;

final class SendEmailDelivery implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $backoff = 60;
    public int $timeout = 30;

    public function __construct(public string $deliveryId)
    {
        $connection = (string) config('queue.email_connection', 'database');
        $driver = config('queue.connections.'.$connection.'.driver');
        if (! in_array($driver, ['database', 'redis', 'beanstalkd', 'sqs'], true)) {
            throw new LogicException('O envio de e-mails exige uma conexão de fila persistente e assíncrona.');
        }

        $this->onConnection($connection);
        $this->afterCommit();
    }

    public function handle(SendEmailAction $action): void
    {
        $action->execute($this->deliveryId);
    }

    public function failed(Throwable $exception): void
    {
        app(FailEmailDeliveryAction::class)->execute($this->deliveryId, $exception);
    }
}
