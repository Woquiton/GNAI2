<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Providers;

use App\Shared\Domain\Support\AuditLogger;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

/**
 * Único ponto de captura do feed de atividades (dashboard) e da auditoria
 * de create/update/delete: escuta os eventos do Eloquent via wildcard, sem
 * tocar em nenhum model/controller/service existente. Para incluir um
 * módulo novo no feed, adicione uma entrada em config/activity_feed.php —
 * nada aqui precisa mudar.
 */
final class ActivityFeedServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $models = array_keys(config('activity_feed.models', []));

        if ($models === []) {
            return;
        }

        \Illuminate\Support\Facades\Event::listen('eloquent.created: *', function (string $event, array $data) use ($models): void {
            $this->capture('created', $data[0] ?? null, $models);
        });

        \Illuminate\Support\Facades\Event::listen('eloquent.updated: *', function (string $event, array $data) use ($models): void {
            $this->capture('updated', $data[0] ?? null, $models);
        });

        \Illuminate\Support\Facades\Event::listen('eloquent.deleted: *', function (string $event, array $data) use ($models): void {
            $this->capture('deleted', $data[0] ?? null, $models);
        });
    }

    /** @param list<class-string> $trackedModels */
    private function capture(string $action, mixed $model, array $trackedModels): void
    {
        if (! $model instanceof Model || ! in_array($model::class, $trackedModels, true)) {
            return;
        }

        match ($action) {
            'created' => AuditLogger::logCreated($model),
            'updated' => AuditLogger::logUpdated($model, $model->getChanges()),
            'deleted' => AuditLogger::logDeleted($model),
        };
    }
}
