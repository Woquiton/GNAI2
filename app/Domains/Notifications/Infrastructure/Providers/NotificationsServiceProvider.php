<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Infrastructure\Providers;

use App\Domains\Notifications\UI\Console\Commands\ProcessGmailBounces;
use App\Domains\Notifications\UI\Console\Commands\SyncGmailFolders;
use App\Domains\Notifications\UI\Console\Commands\SyncGmailReplies;
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
