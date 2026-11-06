<?php

declare(strict_types=1);

namespace App\Domains\Application\Policies\Notifications;

use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Models\Notifications\EmailDelivery;

final readonly class EmailMailboxAccessPolicy
{
    public function ensureCanView(EmailDelivery $email, int $userId): void
    {
        abort_if($email->status === EmailDeliveryStatus::DRAFT && (int) $email->context_id !== $userId, 403);
    }

    public function ensureCanUseAsSource(EmailDelivery $email, int $userId): void
    {
        $this->ensureCanView($email, $userId);
        abort_if($email->status === EmailDeliveryStatus::DRAFT, 409);
    }
}
