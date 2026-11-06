<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Disciplines;

use App\Domains\Domain\Models\Disciplines\Discipline;

final class DisciplineHasCoursesQuery
{
    public function execute(Discipline $discipline): bool
    {
        return $discipline->courses()->exists();
    }
}
