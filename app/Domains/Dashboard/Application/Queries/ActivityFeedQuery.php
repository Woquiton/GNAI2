<?php

declare(strict_types=1);

namespace App\Domains\Dashboard\Application\Queries;

use App\Domains\Audit\Domain\Models\AuditRecord;
use App\Domains\Auth\Domain\Models\User;
use App\Domains\Dashboard\Domain\Enums\ActivityFeedSource;
use App\Domains\Inclusion\Domain\Models\PeiDiscipline;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Atividades recentes do painel: as últimas mudanças nos documentos do AEE, lidas do histórico de
 * auditoria e filtradas por vínculo (LGPD) de acordo com o perfil do usuário logado.
 *
 * - Admin e profissional (coordenação/equipe AEE): veem todos os eventos, como nas demais telas.
 * - Professor (portal do professor): vê só documentos de alunos com quem tem vínculo de PEI vigente
 *   (mesma regra de TeacherPortalController).
 */
final class ActivityFeedQuery
{
    private const PER_PAGE = 10;

    /** @param array<string, mixed> $filters `model` (tipo do documento) e `period`, vindos da tela */
    public function execute(User $user, array $filters = [], int $page = 1): LengthAwarePaginator
    {
        $model = $filters['model'] ?? null;
        $period = $filters['period'] ?? null;

        $query = AuditRecord::query()
            ->whereIn('entity_type', $this->types(is_string($model) ? $model : null))
            ->latest('created_at')
            ->latest('id');

        $this->scopeByAccess($query, $user);
        $this->applyPeriod($query, is_string($period) ? $period : null);

        return $query->paginate(self::PER_PAGE, page: $page);
    }

    /** @return list<string> todos os documentos do feed, só o escolhido ou nenhum, se o filtro for inválido */
    private function types(?string $model): array
    {
        if ($model === null || $model === '') {
            return ActivityFeedSource::types();
        }

        $source = ActivityFeedSource::tryFrom($model);

        return $source !== null ? [$source->value] : [];
    }

    private function scopeByAccess(Builder $query, User $user): void
    {
        if ($user->isAdmin() || $user->professional_id !== null) {
            return;
        }

        if ($user->teacher_id === null) {
            $query->whereRaw('1 = 0');

            return;
        }

        $studentIds = PeiDiscipline::query()
            ->where('teacher_id', $user->teacher_id)
            ->whereHas('pei', fn (Builder $pei) => $pei->where('is_current', true))
            ->join('peis', 'peis.id', '=', 'pei_disciplines.pei_id')
            ->pluck('peis.student_id')
            ->map(fn (mixed $id): int => (int) $id)
            ->unique()
            ->values()
            ->all();

        $query->where(function (Builder $linked) use ($studentIds): void {
            $linked->whereRaw('1 = 0');

            foreach (ActivityFeedSource::cases() as $source) {
                $linked->orWhere(fn (Builder $records) => $records
                    ->where('entity_type', $source->value)
                    ->whereIn('entity_id', $source->entityIdsOfStudents($studentIds)));
            }
        });
    }

    private function applyPeriod(Builder $query, ?string $period): void
    {
        match ($period) {
            'today' => $query->whereDate('created_at', today()),
            '7days' => $query->where('created_at', '>=', now()->subDays(7)),
            '30days' => $query->where('created_at', '>=', now()->subDays(30)),
            default => null,
        };
    }
}
