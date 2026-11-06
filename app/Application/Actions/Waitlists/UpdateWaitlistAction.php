<?php

declare(strict_types=1);

namespace App\Application\Actions\Waitlists;

use App\Application\Data\Waitlists\UpdateWaitlistData;
use App\Domain\DTOs\Waitlists\UpdateWaitlistDTO;
use App\Domain\Exceptions\InvalidWaitlist;
use App\Domain\Models\Waitlist;

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
