<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Tags;

use App\Domains\Domain\Models\Tags\Tag;

final class ShowTagQuery
{
    public function execute(Tag $tag): Tag
    {
        return $tag->loadCount(['publications', 'mailboxStates']);
    }
}
