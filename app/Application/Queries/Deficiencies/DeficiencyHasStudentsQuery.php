<?php

declare(strict_types=1);

namespace App\Application\Queries\Deficiencies;

use App\Domain\Models\Deficiency;

final class DeficiencyHasStudentsQuery
{
    public function execute(Deficiency $deficiency): bool
    {
        return $deficiency->students()->exists();
    }
}
