<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Providers\Notifications;

use App\Domains\UI\Console\Commands\Notifications\ProcessGmailBounces;
use App\Domains\UI\Console\Commands\Notifications\SyncGmailFolders;
use App\Domains\UI\Console\Commands\Notifications\SyncGmailReplies;
use Illuminate\Support\ServiceProvider;

final class NotificationsServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->commands([
            ProcessGmailBounces::class,
            SyncGmailReplies::class,
            SyncGmailFolders::class,
        ]);
    }
}
