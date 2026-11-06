<?php

declare(strict_types=1);

namespace App\Application\Queries\Professionals;

use App\Domain\Models\Professional;

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
