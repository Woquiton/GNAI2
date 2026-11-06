<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Loans;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Data\Loans\ReturnLoanData;
use App\Domains\Application\Handlers\Loans\LoanStockHandler;
use App\Domains\Application\Handlers\Loans\LoanWaitlistHandler;
use App\Domains\Application\Handlers\Loans\LoanableLockHandler;
use App\Domains\Application\Services\Loans\LoanReturnConfirmationSender;
use App\Domains\Domain\DTOs\Loans\ReturnLoanDTO;
use App\Domains\Domain\Enums\Loans\LoanStatus;
use App\Domains\Domain\Models\Loans\Loan;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class ReturnLoanAction
{
    public function __construct(
        private LoanableLockHandler $loanables,
        private LoanStockHandler $stock,
        private LoanWaitlistHandler $waitlists,
        private LoanReturnConfirmationSender $confirmationSender,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Loan $loan, ReturnLoanData $data, User $returnedBy): Loan
    {
        $returnedLoan = DB::transaction(function () use ($loan, $data, $returnedBy): Loan {
            $item = $this->loanables->lockForLoan(
                id: $loan->loanable_id,
            );

            $returnDate = now();
            $status = Loan::returnedStatus(
                isDamaged: $data->isDamaged,
                returnDate: $returnDate,
                dueDate: $loan->due_date,
            );

            $returnLoanDTO = new ReturnLoanDTO(
                returnDate: $returnDate,
                status: $status,
                observation: $data->observation,
            );

            $loan->registerReturn($returnLoanDTO);
            $loan->save();

            $this->stock->returnFromLoanStatus($item, $status);

            if ($status !== LoanStatus::DAMAGED) {
                $this->waitlists->notifyNext($item, $returnedBy);
            }

            return $loan;
        });

        $returnedLoan = $returnedLoan->fresh([
            'loanable',
            'student.person',
            'professional.person',
            'user',
        ]);

        $this->confirmationSender->send($returnedLoan, $returnedBy);

        return $returnedLoan;
    }
}
