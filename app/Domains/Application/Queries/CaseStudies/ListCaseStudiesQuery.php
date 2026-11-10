<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\CaseStudies;

use App\Domains\Application\Data\CaseStudies\ListCaseStudiesData;
use App\Domains\Domain\Models\CaseStudies\CaseStudy;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListCaseStudiesQuery
{
    public function execute(ListCaseStudiesData $filters, ?Student $student = null): LengthAwarePaginator
    {
        return CaseStudy::query()
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ))
            ->with(['student.person', 'creator', 'semester'])
            ->withCount('paees')
            ->when($student !== null, fn ($query) => $query->where('student_id', $student->getKey()))
            ->when($filters->status !== null, fn ($query) => $query->where('status', $filters->status))
            ->when($filters->semesterId !== null, fn ($query) => $query->where('semester_id', $filters->semesterId))
            ->when($filters->search !== null && $filters->search !== '', fn ($query) => $query->whereHas(
                'student.person',
                fn ($person) => $person->where('name', 'like', "%{$filters->search}%")
            ))
            ->orderByDesc('id')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
