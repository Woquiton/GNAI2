<?php

declare(strict_types=1);

namespace App\Application\Queries\Authorship;

use Illuminate\Support\Facades\DB;

/**
 * Indica se o usuário é autor de PEI, PAEE, estudo de caso ou de seus históricos. Esses registros guardam
 * o autor e não podem perder a referência, então o usuário não pode ser excluído enquanto eles existirem.
 */
final class UserHasAuthoredPedagogicalRecordsQuery
{
    public function execute(?int $userId): bool
    {
        if ($userId === null) {
            return false;
        }

        return DB::table('peis')->where('creator_id', $userId)->exists()
            || DB::table('pei_disciplines')->where('creator_id', $userId)->exists()
            || DB::table('pei_discipline_revisions')->where('reviewer_id', $userId)->exists()
            || DB::table('paees')->where('creator_id', $userId)->exists()
            || DB::table('paee_reviews')->where('reviewer_id', $userId)->exists()
            || DB::table('case_studies')->where('creator_id', $userId)->exists()
            || DB::table('case_study_contributions')->where('author_id', $userId)->exists();
    }
}
