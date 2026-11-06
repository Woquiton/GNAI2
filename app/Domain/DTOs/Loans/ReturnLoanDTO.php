<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Loans;

use App\Domain\Enums\LoanStatus;
use DateTimeInterface;

final readonly class ReturnLoanDTO
{
    public function __construct(
        public DateTimeInterface $returnDate,
        public LoanStatus $status,
        public ?string $observation,
    ) {}
}
