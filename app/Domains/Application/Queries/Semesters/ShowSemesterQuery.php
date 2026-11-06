<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Semesters;

use App\Domains\Domain\Models\Semesters\Semester;

final class ShowSemesterQuery
{
    public function execute(Semester $semester): Semester
    {
        return $semester;
    }
}
