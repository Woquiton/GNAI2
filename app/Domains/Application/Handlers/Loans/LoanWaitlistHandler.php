<?php

declare(strict_types=1);

namespace App\Domains\Application\Handlers\Loans;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Domain\Models\Loans\Loan;
use App\Domains\Application\Services\Waitlists\WaitlistAvailabilitySender;
use App\Domains\Domain\Enums\Waitlists\WaitlistStatus;
use App\Domains\Domain\Models\Waitlists\Waitlist;
use App\Domains\Infrastructure\Notifications\Waitlists\LoanableItemAvailableNotification;

final class LoanWaitlistHandler
{
    public function __construct(private readonly WaitlistAvailabilitySender $availabilitySender) {}

    public function fulfillMatching(
        Item $item,
        ?int $studentId,
        ?int $professionalId,
        Loan $loan,
    ): void {
        $query = Waitlist::query()
            ->where('waitlistable_id', $item->id)
            ->where('waitlistable_type', $item->getMorphClass())
            ->where('requested_at', '<=', $loan->loan_date)
            ->whereIn('status', [
                WaitlistStatus::WAITING->value,
                WaitlistStatus::NOTIFIED->value,
            ]);

        if ($studentId !== null) {
            $query->where('student_id', $studentId);
        }

        if ($professionalId !== null) {
            $query->where('professional_id', $professionalId);
        }

        $waitlist = $query->oldest('requested_at')->orderBy('id')->lockForUpdate()->first();

        if ($waitlist instanceof Waitlist) {
            $waitlist->forceFill([
                'status' => WaitlistStatus::FULFILLED,
                'fulfilled_at' => $loan->loan_date,
                'fulfilled_loan_id' => $loan->getKey(),
            ])->save();
        }
    }

    public function notifyNext(Item $item, User $notifier): ?Waitlist
    {
        $waitlist = Waitlist::query()
            ->where('waitlistable_id', $item->id)
            ->where('waitlistable_type', $item->getMorphClass())
            ->where('status', WaitlistStatus::WAITING->value)
            ->oldest('requested_at')
            ->first();

        if (! $waitlist instanceof Waitlist) {
            return null;
        }

        $waitlist->update([
            'status' => WaitlistStatus::NOTIFIED,
        ]);

        $waitlist->loadMissing([
            'waitlistable',
            'student.person',
            'professional.person',
        ]);

        $notifier->notify(new LoanableItemAvailableNotification($waitlist));
        $this->availabilitySender->send($waitlist);

        return $waitlist;
    }
}
