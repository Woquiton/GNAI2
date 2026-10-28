<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Actions\CaseStudies;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudyContribution;

final class AddCaseStudyContributionAction
{
    public function execute(CaseStudy $caseStudy, User $author, string $role, string $content): CaseStudyContribution
    {
        return $caseStudy->contributions()->create([
            'author_id' => (int) $author->getKey(),
            'role' => $role,
            'content' => $content,
            'created_at' => now(),
        ]);
    }
}
