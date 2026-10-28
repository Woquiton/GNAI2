<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Queries\CaseStudies;

use App\Domains\SpecializedEducationalSupport\Application\Data\CaseStudies\ListCaseStudiesData;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListCaseStudiesQuery
{
    public function execute(ListCaseStudiesData $filters, ?Student $student = null): LengthAwarePaginator
    {
        return CaseStudy::query()
            ->with(['student.person', 'creator', 'semester'])
            ->when($student !== null, fn ($query) => $query->where('student_id', $student->getKey()))
            ->when($filters->status !== null, fn ($query) => $query->where('status', $filters->status))
            ->when($filters->semesterId !== null, fn ($query) => $query->where('semester_id', $filters->semesterId))
            ->when($filters->search !== null && $filters->search !== '', fn ($query) => $query->whereHas(
                'student.person',
                fn ($person) => $person->where('name', 'like', "%{$filters->search}%")
            ))
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();
    }
}
