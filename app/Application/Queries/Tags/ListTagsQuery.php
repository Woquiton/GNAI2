<?php

declare(strict_types=1);

namespace App\Application\Queries\Tags;

use App\Application\Data\Tags\ListTagsData;
use App\Domain\Models\Tag;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListTagsQuery
{
    /**
     * @return LengthAwarePaginator<int, Tag>
     */
    public function execute(ListTagsData $filters): LengthAwarePaginator
    {
        $query = Tag::query();
        $query->when($filters->module, fn ($query, $module) => $query->where('module', $module));

        if (filled($filters->name)) {
            $query->where('name', 'like', '%'.trim($filters->name).'%');
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
