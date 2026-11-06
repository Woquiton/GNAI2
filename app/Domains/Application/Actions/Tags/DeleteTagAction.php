<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Tags;

use App\Domains\Domain\Models\Tags\Tag;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteTagAction
{
    /**
     * @throws Throwable
     */
    public function execute(Tag $tag): void
    {
        DB::transaction(function () use ($tag): void {
            Tag::query()
                ->findOrFail($tag->getKey())
                ->delete();
        });
    }
}
