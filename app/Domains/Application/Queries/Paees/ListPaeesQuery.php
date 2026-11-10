<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Paees;

use App\Domains\Application\Data\Paees\ListPaeesData;
use App\Domains\Domain\Models\Paees\Paee;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListPaeesQuery
{
    public function execute(ListPaeesData $filters, ?Student $student = null): LengthAwarePaginator
    {
        return Paee::query()
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ))
            ->with(['student.person', 'creator', 'semester', 'caseStudy'])
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
