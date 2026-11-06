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
        $query = Publication::query();

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
