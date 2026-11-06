<?php

declare(strict_types=1);

namespace App\Application\Queries\Semesters;

use App\Domain\Models\Semester;

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
