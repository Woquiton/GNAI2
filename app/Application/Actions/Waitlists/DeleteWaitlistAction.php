<?php

declare(strict_types=1);

namespace App\Application\Actions\Waitlists;

use App\Domain\Exceptions\InvalidWaitlist;
use App\Domain\Models\Waitlist;

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
