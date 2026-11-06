<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\CaseStudies;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\CaseStudies\CaseStudy;
use App\Domains\Domain\Models\CaseStudies\CaseStudyContribution;
use Illuminate\Support\Facades\DB;

final class AddCaseStudyContributionAction
{
    public function execute(CaseStudy $caseStudy, User $author, string $role, string $content): CaseStudyContribution
    {
        return DB::transaction(function () use ($caseStudy, $author, $role, $content): CaseStudyContribution {
            $locked = CaseStudy::query()->lockForUpdate()->findOrFail($caseStudy->getKey());
            $locked->student()->lockForUpdate()->firstOrFail()->ensureNotInIntake();

            return $locked->contributions()->create([
                'author_id' => (int) $author->getKey(),
                'role' => $role,
                'content' => $content,
                'created_at' => now(),
            ]);
        });
    }
}
