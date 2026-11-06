<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Providers\Website;

use App\Domains\Infrastructure\Audit\AuditableEntities;
use App\Domains\Domain\Models\Website\WebsiteSetting;
use Illuminate\Support\ServiceProvider;

final class WebsiteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->app->make(AuditableEntities::class)->register(
            WebsiteSetting::class,
        );
    }
}
