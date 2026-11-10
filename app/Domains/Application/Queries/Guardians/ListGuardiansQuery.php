<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Guardians;

use App\Domains\Application\Data\Guardians\ListGuardiansData;
use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListGuardiansQuery
{
    /**
     * @return LengthAwarePaginator<int, Guardian>
     */
    public function execute(Student $student, ListGuardiansData $filters): LengthAwarePaginator
    {
        $query = Guardian::query()
            ->when(filled($filters->phone), fn ($query) => $query->whereHas(
                'person',
                fn ($related) => $related->where('phone', 'like', '%'.trim($filters->phone).'%'),
            ))
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ))
            ->select('student_guardians.*')
            ->join('people', 'people.id', '=', 'student_guardians.person_id')
            ->with('person')
            ->where('student_guardians.student_id', $student->getKey());

        if (filled($filters->name)) {
            $query->where('people.name', 'like', trim($filters->name).'%');
        }

        if (filled($filters->email)) {
            $query->where('people.email', 'like', '%'.trim($filters->email).'%');
        }

        if ($filters->relationship !== null) {
            $query->where('student_guardians.relationship', $filters->relationship->value);
        }

        return $query
            ->latest('student_guardians.id')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
