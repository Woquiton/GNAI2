<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Professionals;

use App\Domains\Application\Data\Professionals\ListProfessionalsData;
use App\Domains\Domain\Models\Professionals\Professional;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListProfessionalsQuery
{
    /**
     * @return LengthAwarePaginator<int, Professional>
     */
    public function execute(ListProfessionalsData $filters): LengthAwarePaginator
    {
        $query = Professional::query()
            ->when(filled($filters->phone), fn ($query) => $query->whereHas(
                'person',
                fn ($related) => $related->where('phone', 'like', '%'.trim($filters->phone).'%'),
            ))
            ->when($filters->showOnWebsite !== null, fn ($query) => $query->where('show_on_website', $filters->showOnWebsite))
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ))
            ->select('professionals.*')
            ->join('people', 'people.id', '=', 'professionals.person_id')
            ->with(['person', 'position']);

        if (filled($filters->name)) {
            $query->where('people.name', 'like', '%'.trim($filters->name).'%');
        }

        if (filled($filters->email)) {
            $query->where('people.email', 'like', '%'.trim($filters->email).'%');
        }

        if (filled($filters->registration)) {
            $query->where('professionals.registration', 'like', '%'.trim($filters->registration).'%');
        }

        if ($filters->position !== null) {
            $query->where('professionals.position_id', $filters->position);
        }

        if ($filters->status !== null) {
            $query->where('professionals.status', $filters->status->value);
        }

        return $query
            ->orderBy('people.name')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
