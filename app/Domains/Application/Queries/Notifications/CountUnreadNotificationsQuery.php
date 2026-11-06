<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Notifications;

use App\Domains\Domain\Models\Auth\User;

final readonly class CountUnreadNotificationsQuery
{
    public function execute(User $user): int
    {
        return $user
            ->unreadNotifications()
            ->count();
    }
}
