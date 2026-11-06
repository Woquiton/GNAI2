<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Pendencies;

use App\Domains\Domain\Models\Pendencies\Pendency;

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
