<?php

declare(strict_types=1);

namespace App\Application\Actions\Sessions;

use App\Domain\Models\Session;

final readonly class RestoreSessionAction
{
    public function execute(Session $session): Session
    {
        $session->restore();

        return $session;
    }
}
