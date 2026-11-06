<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Providers\Reporting;

use App\Domains\Application\Services\Reporting\ReportCatalog;
use Illuminate\Support\ServiceProvider;

final class ReportingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(ReportCatalog::class);
    }
}
