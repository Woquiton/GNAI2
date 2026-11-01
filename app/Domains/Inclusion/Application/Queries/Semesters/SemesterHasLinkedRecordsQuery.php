<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\Semesters;

use App\Domains\Inclusion\Domain\Models\Semester;

final class SemesterHasLinkedRecordsQuery
{
    public function execute(Semester $semester): bool
    {
        return $semester->studentDocuments()->exists()
            || $semester->peis()->exists();
    }
}
