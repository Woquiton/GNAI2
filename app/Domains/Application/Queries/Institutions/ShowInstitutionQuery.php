<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Institutions;

use App\Domains\Domain\Models\Institutions\Institution;

final class ShowInstitutionQuery
{
    public function execute(Institution $institution): Institution
    {
        return $institution->load(['locations', 'barriers']);
    }
}
