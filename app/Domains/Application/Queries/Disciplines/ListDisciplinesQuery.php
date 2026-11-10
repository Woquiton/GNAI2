<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Disciplines;

use App\Domains\Application\Data\Disciplines\ListDisciplinesData;
use App\Domains\Domain\Models\Disciplines\Discipline;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListDisciplinesQuery
{
    /**
     * @return LengthAwarePaginator<int, Discipline>
     */
    public function execute(ListDisciplinesData $filters): LengthAwarePaginator
    {
        $query = Discipline::query()
            ->when(filled($filters->courseName), fn ($query) => $query->whereHas(
                'courses',
                fn ($related) => $related->where('name', 'like', '%'.trim($filters->courseName).'%'),
            ))
            ->when(filled($filters->teacherName), fn ($query) => $query->whereHas(
                'teachers.person',
                fn ($related) => $related->where('name', 'like', '%'.trim($filters->teacherName).'%'),
            ))
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ));

        if (filled($filters->name)) {
            $query->where('name', 'like', trim($filters->name).'%');
        }

        if ($filters->isActive !== null) {
            $query->where('is_active', $filters->isActive);
        }

        return $query
            ->orderBy('name')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
