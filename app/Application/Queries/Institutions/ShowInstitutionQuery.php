<?php

declare(strict_types=1);

namespace App\Application\Queries\Institutions;

use App\Domain\Models\Institution;

final class ShowInstitutionQuery
{
    public function execute(Institution $institution): Institution
    {
        return $institution->load(['locations', 'barriers']);
    }
}
