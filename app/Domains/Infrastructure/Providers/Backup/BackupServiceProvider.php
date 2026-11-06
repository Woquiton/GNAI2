<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Providers\Backup;

use App\Domains\Infrastructure\Audit\AuditableEntities;
use App\Domains\Application\Actions\Backup\PruneBackupsAction;
use App\Domains\Application\Contracts\Backup\BackupArchiveStorageContract;
use App\Domains\Application\Contracts\Backup\PruneBackupsActionContract;
use App\Domains\Domain\Models\Backup\Backup;
use App\Domains\Infrastructure\Storage\Backup\BackupArchiveStorage;
use App\Domains\UI\Console\Commands\Backup\BackupAutomatic;
use Illuminate\Support\ServiceProvider;

final class BackupServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(BackupArchiveStorageContract::class, BackupArchiveStorage::class);
        $this->app->bind(PruneBackupsActionContract::class, PruneBackupsAction::class);
    }

    public function boot(): void
    {
        $this->commands([
            BackupAutomatic::class,
        ]);

        $this->app->make(AuditableEntities::class)->register(Backup::class);
    }
}
