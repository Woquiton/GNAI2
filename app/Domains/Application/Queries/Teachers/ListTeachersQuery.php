<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Teachers;

use App\Domains\Application\Data\Teachers\ListTeachersData;
use App\Domains\Domain\Models\Teachers\Teacher;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class ListTeachersQuery
{
    /**
     * @return LengthAwarePaginator<int, Teacher>
     */
    public function execute(ListTeachersData $filters): LengthAwarePaginator
    {
        return Teacher::query()
            ->with('person')
            ->join('people', 'people.id', '=', 'teachers.person_id')
            ->select('teachers.*')
            ->when(
                $filters->name,
                fn (Builder $query, string $term): Builder => $query->whereHas(
                    'person',
                    fn (Builder $query): Builder => $query->where('name', 'like', "%{$term}%"),
                ),
            )
            ->when(
                $filters->email,
                fn (Builder $query, string $term): Builder => $query->whereHas(
                    'person',
                    fn (Builder $query): Builder => $query->where('email', 'like', "%{$term}%"),
                ),
            )
            ->when(
                $filters->registration,
                fn (Builder $query, string $term): Builder => $query->where('registration', 'like', "%{$term}%"),
            )
            ->orderBy('people.name')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
