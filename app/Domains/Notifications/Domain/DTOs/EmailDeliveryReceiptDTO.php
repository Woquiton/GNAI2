<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Domain\DTOs;

use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;

final readonly class EmailDeliveryReceiptDTO
{
    public function __construct(
        public string $deliveryId,
        public EmailDeliveryStatus $status,
        public ?string $sentAt,
        public ?string $messageId,
    ) {}
}
