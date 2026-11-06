<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Guardians;

use App\Domains\Domain\Models\Guardians\Guardian;

final class ShowGuardianQuery
{
    public function execute(Guardian $guardian): Guardian
    {
        return $guardian->load([
            'person',
            'student.person',
        ]);
    }
}
