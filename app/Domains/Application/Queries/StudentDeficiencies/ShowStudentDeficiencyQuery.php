<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\StudentDeficiencies;

use App\Domains\Domain\Models\StudentDeficiencies\StudentDeficiency;

final class ShowStudentDeficiencyQuery
{
    public function execute(StudentDeficiency $studentDeficiency): StudentDeficiency
    {
        return $studentDeficiency->load('deficiency');
    }
}
