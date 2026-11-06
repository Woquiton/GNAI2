<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Institutions;

use App\Domains\Application\Data\Institutions\CreateInstitutionData;
use App\Domains\Domain\Models\Institutions\Institution;

final class InstitutionExistsQuery
{
    public function execute(): bool
    {
        return Institution::query()->exists();
    }
}
