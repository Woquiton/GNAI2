<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Waitlists;

use App\Domains\Application\Handlers\Loans\LoanableLockHandler;
use App\Domains\Domain\Models\Students\Student;
use App\Domains\Application\Data\Waitlists\CreateWaitlistData;
use App\Domains\Application\Policies\Waitlists\WaitlistRegistrationPolicy;
use App\Domains\Application\Services\Waitlists\WaitlistRegistrationSender;
use App\Domains\Domain\DTOs\Waitlists\CreateWaitlistDTO;
use App\Domains\Domain\Models\Waitlists\Waitlist;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateWaitlistAction
{
    public function __construct(
        private LoanableLockHandler $loanables,
        private WaitlistRegistrationPolicy $registrationPolicy,
        private WaitlistRegistrationSender $registrationSender,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(CreateWaitlistData $data, int $registeredBy): Waitlist
    {
        $waitlist = DB::transaction(function () use ($data, $registeredBy): Waitlist {
            if ($data->studentId !== null) {
                Student::query()->lockForUpdate()->findOrFail($data->studentId)->ensureNotInIntake();
            }

            $item = $this->loanables->lockForLoan(
                id: $data->waitlistableId,
                expectedType: $data->itemType,
            );

            $this->registrationPolicy->ensureCanRegister($item, $data);

            $waitlistDTO = new CreateWaitlistDTO(
                waitlistableId: $item->id,
                waitlistableType: $item->getMorphClass(),
                studentId: $data->studentId,
                professionalId: $data->professionalId,
                registeredBy: $registeredBy,
                requestedAt: now(),
                observation: $data->observation,
            );

            $waitlist = Waitlist::register($waitlistDTO);
            $waitlist->save();

            return $waitlist;
        });

        $waitlist = $waitlist->fresh([
            'waitlistable',
            'student.person',
            'professional.person',
            'user',
        ]);

        $this->registrationSender->send($waitlist);

        return $waitlist;
    }
}
