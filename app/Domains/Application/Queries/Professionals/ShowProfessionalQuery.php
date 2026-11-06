<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Professionals;

use App\Domains\Domain\Models\Professionals\Professional;

final class ShowProfessionalQuery
{
    public function execute(Professional $professional): Professional
    {
        return $professional->load([
            'person',
            'position',
            'user',
        ]);
    }
}
