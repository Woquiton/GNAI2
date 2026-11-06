<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Notifications;

enum EmailMailboxOperation: string
{
    case READ = 'read';
    case UNREAD = 'unread';
    case STAR = 'star';
    case UNSTAR = 'unstar';
    case ARCHIVE = 'archive';
    case SPAM = 'spam';
    case TRASH = 'trash';
    case RESTORE = 'restore';
    case LABEL = 'label';

    public function movesFolder(): bool
    {
        return in_array($this, [self::ARCHIVE, self::SPAM, self::TRASH, self::RESTORE], true);
    }
}
