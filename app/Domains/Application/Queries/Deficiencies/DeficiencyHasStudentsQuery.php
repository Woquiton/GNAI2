<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Deficiencies;

use App\Domains\Domain\Models\Deficiencies\Deficiency;

final class DeficiencyHasStudentsQuery
{
    public function execute(Deficiency $deficiency): bool
    {
        return $deficiency->students()->exists();
    }
}
