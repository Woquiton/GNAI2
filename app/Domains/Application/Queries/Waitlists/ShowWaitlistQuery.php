<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Waitlists;

use App\Domains\Domain\Models\Waitlists\Waitlist;

final class ShowWaitlistQuery
{
    public function execute(Waitlist $waitlist): Waitlist
    {
        return $waitlist->loadMissing([
            'waitlistable',
            'student.person',
            'professional.person',
            'user',
        ]);
    }
}
