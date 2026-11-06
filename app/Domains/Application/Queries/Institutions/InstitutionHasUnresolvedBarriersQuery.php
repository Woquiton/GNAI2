<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Institutions;

use App\Domains\Domain\Models\Institutions\Institution;

final class InstitutionHasUnresolvedBarriersQuery
{
    public function execute(Institution $institution): bool
    {
        return $institution
            ->barriers()
            ->whereNull('resolved_at')
            ->exists();
    }
}
