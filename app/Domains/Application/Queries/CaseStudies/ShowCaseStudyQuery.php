<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\CaseStudies;

use App\Domains\Domain\Models\CaseStudies\CaseStudy;

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
