<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Waitlists;

use App\Domains\Application\Data\Waitlists\UpdateWaitlistData;
use App\Domains\Domain\DTOs\Waitlists\UpdateWaitlistDTO;
use App\Domains\Domain\Exceptions\Waitlists\InvalidWaitlist;
use App\Domains\Domain\Models\Waitlists\Waitlist;

final class UpdateWaitlistAction
{
    /**
     * @throws InvalidWaitlist
     */
    public function execute(Waitlist $waitlist, UpdateWaitlistData $data): Waitlist
    {
        $waitlistDTO = new UpdateWaitlistDTO(
            status: $data->status,
            observation: $data->observation,
        );

        $waitlist->revise($waitlistDTO);
        $waitlist->save();

        return $waitlist->fresh([
            'waitlistable',
            'student.person',
            'professional.person',
            'user',
        ]);
    }
}
