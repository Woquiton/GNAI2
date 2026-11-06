<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Providers\Auth;

use App\Domains\Infrastructure\Audit\AuditableEntities;
use App\Domains\Application\Permissions\Auth\PermissionCache;
use App\Domains\Application\Permissions\Auth\PermissionRegistry;
use App\Domains\Application\Queries\Auth\Permissions\UserHasPermissionQuery;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\UI\Console\Commands\Auth\CreateAdminUser;
use App\Domains\UI\Console\Commands\Auth\ResetAdminPassword;
use App\Domains\UI\Console\Commands\Auth\SyncPermissions;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Throwable;

final class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(PermissionCache::class);
        $this->app->scoped(PermissionRegistry::class);
        $this->app->scoped(UserHasPermissionQuery::class);
    }

    public function boot(): void
    {
        $this->commands([
            CreateAdminUser::class,
            ResetAdminPassword::class,
            SyncPermissions::class,
        ]);

        $this->app->make(AuditableEntities::class)->register(User::class);

        Gate::before(function ($user, string $ability): ?bool {
            if ($user->isAdmin()) {
                return true;
            }

            if (! app(PermissionRegistry::class)->has($ability)) {
                return null;
            }

            if (! $this->canUsePermissionsTable()) {
                return false;
            }

            return app(UserHasPermissionQuery::class)->execute($user, $ability);
        });
    }

    private function canUsePermissionsTable(): bool
    {
        try {
            return Schema::hasTable('permissions');
        } catch (Throwable) {
            return false;
        }
    }
}
