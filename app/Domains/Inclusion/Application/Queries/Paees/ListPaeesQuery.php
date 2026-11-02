<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\Paees;

use App\Domains\Inclusion\Application\Data\Paees\ListPaeesData;
use App\Domains\Inclusion\Domain\Models\Paee;
use App\Domains\Inclusion\Domain\Models\Student;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListPaeesQuery
{
    public function execute(ListPaeesData $filters, ?Student $student = null): LengthAwarePaginator
    {
        return Paee::query()
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
