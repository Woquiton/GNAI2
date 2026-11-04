<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Infrastructure\Jobs;

use App\Domains\Notifications\Application\Actions\Email\FailEmailDeliveryAction;
use App\Domains\Notifications\Application\Actions\Email\SendEmailAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

final class SendEmailDelivery implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $backoff = 60;
    public int $timeout = 30;

    public function __construct(public string $deliveryId)
    {
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
