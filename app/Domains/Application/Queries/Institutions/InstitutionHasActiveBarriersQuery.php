<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Institutions;

use App\Domains\Domain\Models\Institutions\Institution;

final class InstitutionHasActiveBarriersQuery
{
    public function execute(Institution $institution): bool
    {
        return $institution
            ->barriers()
            ->get()
            ->contains(function ($barrier): bool {
                $status = $barrier->latestStatus();

                if (! $status) {
                    return true;
                }

                return ! $status->allowsDeletion();
            });
    }
}
