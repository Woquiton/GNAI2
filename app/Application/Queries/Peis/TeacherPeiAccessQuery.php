<?php

declare(strict_types=1);

namespace App\Application\Queries\Peis;

use App\Domains\Auth\Domain\Models\User;
use App\Domain\Models\Pei;
use Illuminate\Database\Eloquent\Builder;

/**
 * O professor só acessa os PEIs em que é responsável por alguma adaptação. Os demais usuários seguem
 * apenas as permissões das rotas.
 */
final class TeacherPeiAccessQuery
{
    /**
     * @param  Builder<Pei>  $query
     * @return Builder<Pei>
     */
    public function scope(Builder $query, ?User $user): Builder
    {
        $teacherId = $user?->teacher_id;

        if ($teacherId === null) {
            return $query;
        }

        return $query->whereHas(
            'peiDisciplines',
            fn (Builder $adaptations) => $adaptations->where('teacher_id', $teacherId),
        );
    }

    public function canView(Pei $pei, ?User $user): bool
    {
        $teacherId = $user?->teacher_id;

        return $teacherId === null
            || $pei->peiDisciplines()->where('teacher_id', $teacherId)->exists();
    }
}
