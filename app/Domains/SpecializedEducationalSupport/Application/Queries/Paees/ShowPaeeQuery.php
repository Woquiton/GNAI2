<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Queries\Paees;

use App\Domains\SpecializedEducationalSupport\Domain\Models\Paee;

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
