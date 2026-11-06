<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Deficiencies;

use App\Domains\Domain\Models\Deficiencies\Deficiency;

final class ShowDeficiencyQuery
{
    public function execute(Deficiency $deficiency): Deficiency
    {
        return $deficiency;
    }
}
