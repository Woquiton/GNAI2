<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Notifications\Loans;

use App\Domains\Domain\Models\Loans\Loan;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

final class LoanOverdueNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly Loan $loan,
    ) {}

    /**
     * @return list<string>
     */
    public function via(mixed $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(mixed $notifiable): array
    {
        $loan = $this->loan->loadMissing([
            'loanable',
            'student.person',
            'professional.person',
        ]);

        $beneficiary = $loan->student?->person?->name
            ?? $loan->professional?->person?->name
            ?? 'N/A';

        $itemName = $loan->loanable?->name ?? 'Item';
        $daysOverdue = max(0, (int) floor($loan->due_date->diffInDays(now())));
        $delay = $daysOverdue > 0 ? "há {$daysOverdue} dia(s)" : 'desde hoje';

        return [
            'loan_id' => $loan->id,
            'title' => 'Empréstimo Atrasado',
            'message' => "A devolução do item '{$itemName}', emprestado a {$beneficiary}, está em atraso {$delay}.",
            'url' => route('inclusive-radar.loans.show', $loan->id, absolute: false),
        ];
    }
}
