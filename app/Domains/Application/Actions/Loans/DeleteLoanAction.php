<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Loans;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Handlers\Loans\LoanStockHandler;
use App\Domains\Application\Handlers\Loans\LoanWaitlistHandler;
use App\Domains\Application\Handlers\Loans\LoanableLockHandler;
use App\Domains\Domain\Exceptions\Loans\InvalidLoan;
use App\Domains\Domain\Models\Loans\Loan;
use App\Domains\Domain\Models\Waitlists\Waitlist;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteLoanAction
{
    public function __construct(
        private LoanableLockHandler $loanables,
        private LoanStockHandler $stock,
        private LoanWaitlistHandler $waitlists,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Loan $loan, User $deletedBy): void
    {
        DB::transaction(function () use ($loan, $deletedBy): void {
            if (Waitlist::query()->where('fulfilled_loan_id', $loan->getKey())->exists()) {
                throw new InvalidLoan('Este empréstimo atendeu uma solicitação da fila de espera e deve ser preservado no histórico.');
            }
            if ($loan->return_date === null) {
                $item = $this->loanables->lockForLoan(
                    id: $loan->loanable_id,
                );

                $this->stock->returnAvailable($item);
                $this->waitlists->notifyNext($item, $deletedBy);
            }

            $loan->delete();
        });
    }
}
