<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Providers\Audit;

use App\Domains\Infrastructure\Audit\AuditableEntities;
use App\Domains\Infrastructure\Audit\AuditContext;
use Illuminate\Database\Events\TransactionRolledBack;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

final class AuditServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Uma operação por requisição/comando (php-fpm: um processo por requisição).
        $this->app->singleton(AuditContext::class);
        // Preenchido no boot de cada domínio com os seus models auditáveis.
        $this->app->singleton(AuditableEntities::class);
    }

    public function boot(): void
    {
        // Registro desfeito pelo rollback não pode receber a fusão de gravações seguintes da operação.
        Event::listen(
            TransactionRolledBack::class,
            fn () => $this->app->make(AuditContext::class)->forgetRecords(),
        );
    }
}
