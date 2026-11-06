<?php

declare(strict_types=1);

namespace App\Application\Actions\Loans;

use App\Application\Data\Loans\UpdateLoanData;
use App\Domain\DTOs\Loans\UpdateLoanDTO;
use App\Domain\Models\Loan;

final readonly class UpdateLoanAction
{
    public function execute(Loan $loan, UpdateLoanData $data): Loan
    {
        $loanDTO = new UpdateLoanDTO(
            observation: $data->observation,
        );

        $loan->revise($loanDTO);
        $loan->save();

        return $loan->fresh([
            'loanable',
            'student.person',
            'professional.person',
            'user',
        ]);
    }
}
