<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\People;

use App\Domains\Application\Data\People\ListPeopleData;
use App\Domains\Domain\Enums\People\PersonRole;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Tags\Tag;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

final class ListPeopleQuery
{
    public function tagOptions(): Collection
    {
        return Tag::query()->where('module', 'people')->orderBy('name')
            ->get(['id', 'name', 'system_key']);
    }

    public function execute(ListPeopleData $filters): LengthAwarePaginator
    {
        $query = Person::query()->with(['student', 'teacher', 'professional', 'guardians', 'tags']);
        if (filled($filters->name)) {
            $query->where('name', 'like', '%'.$filters->name.'%');
        }
        if ($filters->tagId !== null) {
            $tag = Tag::query()->where('module', 'people')->findOrFail($filters->tagId);
            $role = PersonRole::tryFrom($tag->system_key ?? '');
            if ($role !== null) {
                $query->whereHas($role->relationName());
            } else {
                $query->whereHas('tags', fn ($tags) => $tags->whereKey($tag->getKey()));
            }
        }

        return $query->orderBy('name')->paginate(20)->withQueryString();
    }
}
