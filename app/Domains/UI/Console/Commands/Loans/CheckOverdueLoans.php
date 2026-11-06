<?php

namespace App\Domains\UI\Console\Commands\Loans;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Enums\Loans\LoanStatus;
use App\Domains\Domain\Models\Loans\Loan;
use App\Domains\Infrastructure\Notifications\Loans\LoanOverdueNotification;
use Illuminate\Console\Command;

class CheckOverdueLoans extends Command
{
    protected $signature = 'loans:check-overdue';

    protected $description = 'Verifica empréstimos atrasados e notifica os administradores';

    public function handle()
    {
        // Pega todos os empréstimos ativos cuja data de entrega já passou
        $overdueLoans = Loan::where('status', LoanStatus::ACTIVE->value)
            ->where('due_date', '<=', today())
            ->get();

        if ($overdueLoans->isEmpty()) {
            $this->info('Nenhum empréstimo atrasado hoje.');

            return;
        }

        $admins = User::all();

        foreach ($overdueLoans as $loan) {
            foreach ($admins as $admin) {
                $admin->notify(new LoanOverdueNotification($loan));
            }
        }

        $this->info($overdueLoans->count().' notificações de atraso enviadas.');
    }
}
