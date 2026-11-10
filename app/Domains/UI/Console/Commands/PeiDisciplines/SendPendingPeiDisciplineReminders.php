<?php

declare(strict_types=1);

namespace App\Domains\UI\Console\Commands\PeiDisciplines;

use App\Domains\Application\Actions\PeiDisciplines\SendPendingPeiDisciplineRemindersAction;
use Illuminate\Console\Command;

final class SendPendingPeiDisciplineReminders extends Command
{
    protected $signature = 'peis:remind-pending-adaptations';

    protected $description = 'Lembra os criadores sobre adaptações do PEI ainda não preenchidas, a cada cinco dias';

    public function handle(SendPendingPeiDisciplineRemindersAction $action): int
    {
        $this->info($action->execute().' lembrete(s) de adaptação registrado(s).');

        return self::SUCCESS;
    }
}
