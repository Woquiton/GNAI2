<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Waitlists;

use App\Domains\Domain\Exceptions\Waitlists\InvalidWaitlist;
use App\Domains\Domain\Models\Waitlists\Waitlist;

final class DeleteWaitlistAction
{
    /**
     * @throws InvalidWaitlist
     */
    public function execute(Waitlist $waitlist): void
    {
        $waitlist->ensureCanBeDeleted();
        $waitlist->delete();
    }
}
