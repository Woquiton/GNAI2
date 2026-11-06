<?php

declare(strict_types=1);

namespace App\Application\Queries\Disciplines;

use App\Domain\Models\Discipline;

final class DisciplineHasCoursesQuery
{
    public function execute(Discipline $discipline): bool
    {
        return $discipline->courses()->exists();
    }
}
