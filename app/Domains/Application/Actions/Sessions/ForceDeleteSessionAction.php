<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Sessions;

use App\Domains\Domain\Exceptions\Sessions\InvalidSession;
use App\Domains\Domain\Models\Sessions\Session;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class ForceDeleteSessionAction
{
    /**
     * @throws InvalidSession
     * @throws Throwable
     */
    public function execute(Session $session): void
    {
        if (! $session->trashed()) {
            throw new InvalidSession('Apenas agendamentos já removidos podem ser excluídos permanentemente.');
        }

        DB::transaction(fn (): bool|null => $session->forceDelete());
    }
}
