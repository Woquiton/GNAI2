<?php

declare(strict_types=1);

namespace App\Application\Queries\StudentDeficiencies;

use App\Domain\Models\StudentDeficiency;

final class ShowStudentDeficiencyQuery
{
    public function execute(StudentDeficiency $studentDeficiency): StudentDeficiency
    {
        return $studentDeficiency->load('deficiency');
    }
}
