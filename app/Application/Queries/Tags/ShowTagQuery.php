<?php

declare(strict_types=1);

namespace App\Application\Queries\Tags;

use App\Domain\Models\Tag;

final class ShowTagQuery
{
    public function execute(Tag $tag): Tag
    {
        return $tag->loadCount(['publications', 'mailboxStates']);
    }
}
