<?php

declare(strict_types=1);

namespace App\Shared\Domain\Support;

use App\Domains\SpecializedEducationalSupport\Domain\Models\PeiDiscipline;
use App\Shared\Domain\Models\AuditLog;
use Illuminate\Support\Arr;

/**
 * Monta a frase e o link de um item do feed de atividades a partir de uma
 * linha da Auditoria, usando o mapa de config/activity_feed.php. Nunca
 * expõe conteúdo do documento — só a ação, o aluno, o profissional e o
 * detalhe curto já salvo no log (ex.: nome da disciplina).
 */
final class ActivityFeedPresenter
{
    public static function sentence(AuditLog $log): string
    {
        $map = config('activity_feed.models.' . $log->auditable_type, []);
        $label = Arr::get($map, 'label', 'Registro');
        $verb = self::verb($log, $map);
        $actor = $log->user?->name ?? 'usuário removido';
        $student = $log->student_name ?? 'aluno não identificado';

        $sentence = "{$label} de {$student} {$verb} por {$actor}";

        if ($log->detail !== null) {
            $sentence .= " ({$log->detail})";
        }

        return $sentence;
    }

    /** @return array{name: string, params: array<int, mixed>}|null */
    public static function link(AuditLog $log): ?array
    {
        $map = config('activity_feed.models.' . $log->auditable_type);

        if ($map === null || ! isset($map['route_name'], $map['route_params'])) {
            return null;
        }

        $params = [];

        foreach ($map['route_params'] as $key) {
            $value = match ($key) {
                'auditable_id' => $log->auditable_id,
                'student_id' => $log->student_id,
                'pei_id' => PeiDiscipline::find($log->auditable_id)?->pei_id,
                default => null,
            };

            if ($value === null) {
                return null;
            }

            $params[] = $value;
        }

        return ['name' => $map['route_name'], 'params' => $params];
    }

    public static function ability(AuditLog $log): ?string
    {
        return config('activity_feed.models.' . $log->auditable_type . '.ability');
    }

    /** @param array<string, mixed> $map */
    private static function verb(AuditLog $log, array $map): string
    {
        $overrides = Arr::get($map, 'verbs', []);

        return $overrides[$log->action] ?? config('activity_feed.default_verbs.' . $log->action, $log->action);
    }
}
