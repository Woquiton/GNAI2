<?php

declare(strict_types=1);

namespace App\Shared\Domain\Support;

use App\Shared\Domain\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * Auditoria dos documentos sensíveis do AEE (Estudo de Caso, PAEE, PEI):
 * quem acessou ou alterou, quando e o quê (Decreto 12.686/2025, art. 12 §5
 * e art. 14). Também é a fonte do feed de atividades do dashboard: todo
 * create/update/delete chega aqui via o listener de eventos do Eloquent
 * (ActivityFeedServiceProvider), nunca por chamada manual em controller,
 * service ou model — ver config/activity_feed.php para o mapa de módulos.
 *
 * Limitações conhecidas (aceitas, não resolvidas aqui):
 * - Operações em massa (update()/insert()/DB::table) não disparam eventos
 *   do Eloquent e portanto não aparecem na auditoria/feed.
 * - "Preenchido" vs "finalizado" não é distinguido: o evento do Eloquent
 *   só sabe que o model foi criado/alterado, não o significado de negócio.
 */
final class AuditLogger
{
    /** Janela para agrupar edições consecutivas do mesmo usuário no mesmo registro em uma única linha do feed. */
    private const GROUPING_WINDOW_MINUTES = 10;

    public static function logView(Model $model): void
    {
        self::write(AuditLog::ACTION_VIEWED, $model);
    }

    public static function logCreated(Model $model): void
    {
        self::write(AuditLog::ACTION_CREATED, $model);
    }

    public static function logDeleted(Model $model): void
    {
        self::write(AuditLog::ACTION_DELETED, $model);
    }

    /** @param array<string, array{from: mixed, to: mixed}> $changes */
    public static function logUpdated(Model $model, array $changes = []): void
    {
        self::write(AuditLog::ACTION_UPDATED, $model, $changes === [] ? null : $changes, groupable: true);
    }

    /** @param array<string, array{from: mixed, to: mixed}>|null $changes */
    private static function write(string $action, Model $model, ?array $changes = null, bool $groupable = false): void
    {
        $context = self::resolveContext($model);
        $userId = Auth::id();

        if ($groupable && $userId !== null) {
            $recent = AuditLog::query()
                ->where('user_id', $userId)
                ->where('action', $action)
                ->where('auditable_type', $model::class)
                ->where('auditable_id', $model->getKey())
                ->where('created_at', '>=', now()->subMinutes(self::GROUPING_WINDOW_MINUTES))
                ->latest('created_at')
                ->first();

            if ($recent !== null) {
                $recent->update([
                    'changes' => $changes,
                    'created_at' => now(),
                    ...$context,
                ]);

                return;
            }
        }

        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'auditable_type' => $model::class,
            'auditable_id' => $model->getKey(),
            'changes' => $changes,
            'ip_address' => Request::ip(),
            'created_at' => now(),
            ...$context,
        ]);
    }

    /** @return array{student_id: int|null, student_name: string|null, detail: string|null} */
    private static function resolveContext(Model $model): array
    {
        $map = config('activity_feed.models.' . $model::class);

        if ($map === null) {
            return ['student_id' => null, 'student_name' => null, 'detail' => null];
        }

        return [
            'student_id' => Arr::get($map, 'student_id') !== null ? data_get($model, $map['student_id']) : null,
            'student_name' => Arr::get($map, 'student') !== null ? data_get($model, $map['student']) : null,
            'detail' => Arr::get($map, 'detail') !== null ? data_get($model, $map['detail']) : null,
        ];
    }
}
