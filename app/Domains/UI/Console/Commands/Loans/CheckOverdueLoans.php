<?php

declare(strict_types=1);

namespace App\Domains\UI\Console\Commands\Loans;

use App\Domains\Application\Actions\Loans\NotifyOverdueLoansAction;
use Illuminate\Console\Command;

final class CheckOverdueLoans extends Command
{
    protected $signature = 'loans:check-overdue';

    protected $description = 'Notifica o operador do empréstimo e administradores autorizados sobre devoluções em atraso';

    public function handle(NotifyOverdueLoansAction $action): int
    {
        $this->info($action->execute().' notificação(ões) de atraso registrada(s).');

        return self::SUCCESS;
    }
}
