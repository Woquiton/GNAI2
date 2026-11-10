<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Loans;

use App\Domains\Domain\Enums\Loans\LoanStatus;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Loans\Loan;
use App\Domains\Infrastructure\Notifications\Loans\LoanOverdueNotification;
use Illuminate\Support\Facades\DB;

final readonly class NotifyOverdueLoansAction
{
    public function execute(): int
    {
        $sent = 0;
        Loan::query()->where('status', LoanStatus::ACTIVE->value)->where('due_date', '<', now())
            ->select('id')->chunkById(100, function ($loans) use (&$sent): void {
                foreach ($loans as $loan) {
                    $sent += DB::transaction(function () use ($loan): int {
                        $locked = Loan::query()->lockForUpdate()->find($loan->getKey());
                        if ($locked === null || $locked->status !== LoanStatus::ACTIVE || ! $locked->due_date->isPast()) {
                            return 0;
                        }

                        $recipients = User::query()->where(fn ($query) => $query
                            ->whereKey($locked->user_id)->orWhere('is_admin', true)->orWhere('is_super_admin', true))
                            ->get()->filter(fn (User $user): bool => $user->can('loan.show'));
                        $count = 0;
                        foreach ($recipients as $recipient) {
                            $alreadySent = $recipient->notifications()
                                ->where('type', LoanOverdueNotification::class)
                                ->where('data->loan_id', $locked->getKey())
                                ->whereDate('created_at', today())->exists();
                            if ($alreadySent) {
                                continue;
                            }
                            $recipient->notify(new LoanOverdueNotification($locked));
                            $count++;
                        }

                        return $count;
                    });
                }
            });

        return $sent;
    }
}
