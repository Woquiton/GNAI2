<?php

use App\Domains\Infrastructure\Providers\Audit\AuditServiceProvider;
use App\Domains\Infrastructure\Providers\Auth\AuthServiceProvider;
use App\Domains\Infrastructure\Providers\Backup\BackupServiceProvider;
use App\Providers\ResourceServiceProvider;
use App\Domains\Infrastructure\Providers\Notifications\NotificationsServiceProvider;
use App\Domains\Infrastructure\Providers\Reporting\ReportingServiceProvider;
use App\Domains\Infrastructure\Providers\Settings\SettingsServiceProvider;
use App\Domains\Infrastructure\Providers\Website\WebsiteServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    AuditServiceProvider::class,
    AuthServiceProvider::class,
    BackupServiceProvider::class,
    ResourceServiceProvider::class,
    NotificationsServiceProvider::class,
    ReportingServiceProvider::class,
    SettingsServiceProvider::class,
    WebsiteServiceProvider::class,
];
