<?php

declare(strict_types=1);

namespace App\Application\Queries\Deficiencies;

use App\Domain\Models\Deficiency;

final class ShowDeficiencyQuery
{
    public function execute(Deficiency $deficiency): Deficiency
    {
        return $deficiency;
    }
}
