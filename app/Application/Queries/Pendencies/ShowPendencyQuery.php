<?php

declare(strict_types=1);

namespace App\Application\Queries\Pendencies;

use App\Domain\Models\Pendency;

final class ShowPendencyQuery
{
    public function execute(Pendency $pendency): Pendency
    {
        return $pendency->load([
            'assignedProfessional.person',
            'creator.professional.person',
        ]);
    }
}
