<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\Disciplines;

use App\Domains\Inclusion\Domain\Models\Discipline;
use Illuminate\Support\Facades\DB;

final class DisciplineHasPeiAdaptationsQuery
{
    public function execute(Discipline $discipline): bool
    {
        return DB::table('pei_disciplines')->where('discipline_id', $discipline->getKey())->exists();
    }
}
