<?php

declare(strict_types=1);

namespace App\Application\Queries\Institutions;

use App\Application\Data\Institutions\CreateInstitutionData;
use App\Domain\Models\Institution;

final class InstitutionExistsQuery
{
    public function execute(): bool
    {
        return Institution::query()->exists();
    }
}
