<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\CaseStudies;

use App\Domains\Inclusion\Domain\Models\CaseStudy;

final class ShowCaseStudyQuery
{
    public function execute(CaseStudy $caseStudy): CaseStudy
    {
        return $caseStudy->load([
            'student.person',
            'creator',
            'semester',
            'barriers',
            'strategies.linkedBarrier',
            'contributions.author.professional.person',
            'contributions.author.teacher.person',
            'paees',
        ]);
    }
}
