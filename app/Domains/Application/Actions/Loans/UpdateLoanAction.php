<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Loans;

use App\Domains\Application\Data\Loans\UpdateLoanData;
use App\Domains\Domain\DTOs\Loans\UpdateLoanDTO;
use App\Domains\Domain\Models\Loans\Loan;

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
