<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Semesters;

use App\Domains\Domain\Models\Semesters\Semester;

final class CurrentSemesterQuery
{
    public function execute(): ?Semester
    {
        return Semester::query()
            ->where('is_current', true)
            ->sharedLock()
            ->first();
    }
}
