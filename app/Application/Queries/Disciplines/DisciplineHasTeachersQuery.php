<?php

declare(strict_types=1);

namespace App\Application\Queries\Disciplines;

use App\Domain\Models\Discipline;

final class DisciplineHasTeachersQuery
{
    public function execute(Discipline $discipline): bool
    {
        return $discipline->teachers()->exists();
    }
}
