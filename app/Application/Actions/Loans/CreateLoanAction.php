<?php

declare(strict_types=1);

namespace App\Application\Actions\Loans;

use App\Application\Data\Loans\CreateLoanData;
use App\Application\Handlers\Loans\LoanableLockHandler;
use App\Application\Handlers\Loans\LoanStockHandler;
use App\Application\Handlers\Loans\LoanWaitlistHandler;
use App\Application\Policies\Loans\LoanRegistrationPolicy;
use App\Application\Services\Loans\LoanConfirmationSender;
use App\Domain\DTOs\Loans\CreateLoanDTO;
use App\Domain\Models\Loan;
use App\Domain\Models\Student;
use Illuminate\Support\Facades\DB;

final readonly class CreateLoanAction
{
    public function __construct(
        private LoanRegistrationPolicy $registrationPolicy,
        private LoanableLockHandler $loanables,
        private LoanStockHandler $stock,
        private LoanWaitlistHandler $waitlists,
        private LoanConfirmationSender $confirmationSender,
    ) {}

    /**
     * @throws \Throwable
     */
    public function execute(CreateLoanData $data, int $registeredBy): Loan
    {
        $loan = DB::transaction(function () use ($data, $registeredBy): Loan {
            if ($data->studentId !== null) {
                Student::query()->lockForUpdate()->findOrFail($data->studentId)->ensureNotInIntake();
            }

            $item = $this->loanables->lockForLoan(
                id: $data->loanableId,
                expectedType: $data->itemType,
            );

            $this->registrationPolicy->ensureCanRegister(
                item: $item,
                data: $data,
            );
            $this->stock->withdraw($item);

            $loanDTO = new CreateLoanDTO(
                loanableId: $item->id,
                loanableType: $item->getMorphClass(),
                studentId: $data->studentId,
                professionalId: $data->professionalId,
                registeredBy: $registeredBy,
                loanDate: $data->loanDate,
                dueDate: $data->dueDate,
                observation: $data->observation,
            );

            $loan = Loan::register($loanDTO);
            $loan->save();

            $this->waitlists->fulfillMatching(
                loan: $loan,
                item: $item,
                studentId: $data->studentId,
                professionalId: $data->professionalId,
            );

            return $loan;
        });

        $loan = $loan->fresh([
            'loanable',
            'student.person',
            'professional.person',
            'user',
        ]);

        $this->confirmationSender->send($loan);

        return $loan;
    }
}
