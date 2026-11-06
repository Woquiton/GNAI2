<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Waitlists;

use App\Domains\Domain\Exceptions\Waitlists\InvalidWaitlist;
use App\Domains\Domain\Models\Waitlists\Waitlist;

final class CancelWaitlistAction
{
    /**
     * @throws InvalidWaitlist
     */
    public function execute(Waitlist $waitlist): Waitlist
    {
        $waitlist->cancel();
        $waitlist->save();

        return $waitlist->fresh([
            'waitlistable',
            'student.person',
            'professional.person',
            'user',
        ]);
    }
}
