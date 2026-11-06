<?php

declare(strict_types=1);

namespace App\Application\Queries\Semesters;

use App\Domain\Models\Semester;

final class ShowSemesterQuery
{
    public function execute(Semester $semester): Semester
    {
        return $semester;
    }
}
