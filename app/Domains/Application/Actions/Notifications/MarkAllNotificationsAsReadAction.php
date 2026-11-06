<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Notifications;

use App\Domains\Domain\Models\Auth\User;

final readonly class MarkAllNotificationsAsReadAction
{
    public function execute(User $user): void
    {
        $user->unreadNotifications->markAsRead();
    }
}
