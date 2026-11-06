<?php

declare(strict_types=1);

namespace App\Application\Queries\Guardians;

use App\Domain\Models\Guardian;

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
