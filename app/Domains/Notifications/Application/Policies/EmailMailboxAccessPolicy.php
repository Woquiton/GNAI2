<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Policies;

use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Models\EmailDelivery;

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
