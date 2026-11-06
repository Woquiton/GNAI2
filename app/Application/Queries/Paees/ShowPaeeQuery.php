<?php

declare(strict_types=1);

namespace App\Application\Queries\Paees;

use App\Domain\Models\Paee;

final class ShowPaeeQuery
{
    public function execute(Paee $paee): Paee
    {
        return $paee->load([
            'student.person',
            'creator',
            'semester',
            'caseStudy',
            'objectives.linkedBarrier',
            'resources.assistiveTechnology',
            'reviews.reviewer',
        ]);
    }
}
