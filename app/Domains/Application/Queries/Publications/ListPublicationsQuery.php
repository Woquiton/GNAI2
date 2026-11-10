<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Publications;

use App\Domains\Application\Data\Publications\ListPublicationsData;
use App\Domains\Domain\Models\Publications\Publication;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListPublicationsQuery
{
    /**
     * @return LengthAwarePaginator<int, Publication>
     */
    public function execute(ListPublicationsData $filters): LengthAwarePaginator
    {
        $query = Publication::query()
            ->when(filled($filters->authorName), fn ($query) => $query->whereHas(
                'author',
                fn ($related) => $related->where('name', 'like', '%'.trim($filters->authorName).'%'),
            ))
            ->when(filled($filters->tagName), fn ($query) => $query->whereHas(
                'tags',
                fn ($related) => $related->where('name', 'like', '%'.trim($filters->tagName).'%'),
            ))
            ->when($filters->isFeatured !== null, fn ($query) => $query->where('is_featured', $filters->isFeatured))
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ));

        if (filled($filters->title)) {
            $query->where('title', 'like', '%'.trim($filters->title).'%');
        }

        if ($filters->isActive !== null) {
            $query->where('is_active', $filters->isActive);
        }

        if (filled($filters->type)) {
            $query->where('type', $filters->type);
        }

        return $query
            ->with(['author', 'tags'])
            ->orderByRaw('COALESCE(published_at, created_at) DESC')
            ->orderByDesc('id')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
