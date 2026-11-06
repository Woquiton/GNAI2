<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Notifications;

use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;

final readonly class EmailDeliveryReceiptDTO
{
    public function __construct(
        public string $deliveryId,
        public EmailDeliveryStatus $status,
        public ?string $sentAt,
        public ?string $messageId,
    ) {}
}
