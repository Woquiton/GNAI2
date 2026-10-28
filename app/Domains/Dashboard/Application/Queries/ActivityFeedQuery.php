<?php

declare(strict_types=1);

namespace App\Domains\Dashboard\Application\Queries;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PeiDiscipline;
use App\Shared\Domain\Models\AuditLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Feed de atividades do dashboard: lê a Auditoria (audit_logs), já filtrada
 * por vínculo (LGPD) de acordo com o perfil do usuário logado.
 *
 * - Admin e profissional (coordenação/equipe AEE): veem todos os eventos.
 *   Não existe hoje no sistema um conceito de "curso do coordenador" para
 *   restringir por curso — profissionais já têm acesso a todos os alunos
 *   em qualquer outra tela, então o feed segue a mesma regra.
 * - Professor (portal do professor): vê só eventos de alunos com quem tem
 *   vínculo de PEI vigente (mesma regra de TeacherPortalController).
 */
final class ActivityFeedQuery
{
    private const PER_PAGE = 10;

    /** @param array{model?: string, period?: string} $filters */
    public function execute(User $user, array $filters = [], int $page = 1): LengthAwarePaginator
    {
        $query = AuditLog::query()
            ->whereIn('action', [AuditLog::ACTION_CREATED, AuditLog::ACTION_UPDATED, AuditLog::ACTION_DELETED])
            ->whereIn('auditable_type', array_keys(config('activity_feed.models', [])))
            ->with('user')
            ->latest('created_at');

        $this->scopeByAccess($query, $user);
        $this->applyFilters($query, $filters);

        return $query->paginate(self::PER_PAGE, page: $page);
    }

    private function scopeByAccess(Builder $query, User $user): void
    {
        if ($user->isAdmin() || $user->professional_id !== null) {
            return;
        }

        if ($user->teacher_id !== null) {
            $studentIds = PeiDiscipline::query()
                ->where('teacher_id', $user->teacher_id)
                ->whereHas('pei', fn ($q) => $q->where('is_current', true))
                ->join('peis', 'peis.id', '=', 'pei_disciplines.pei_id')
                ->pluck('peis.student_id');

            $query->whereIn('student_id', $studentIds);

            return;
        }

        $query->whereRaw('1 = 0');
    }

    /** @param array{model?: string, period?: string} $filters */
    private function applyFilters(Builder $query, array $filters): void
    {
        if (! empty($filters['model'])) {
            $query->where('auditable_type', $filters['model']);
        }

        match ($filters['period'] ?? null) {
            'today' => $query->whereDate('created_at', today()),
            '7days' => $query->where('created_at', '>=', now()->subDays(7)),
            '30days' => $query->where('created_at', '>=', now()->subDays(30)),
            default => null,
        };
    }
}
