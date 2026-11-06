<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Sessions;

use App\Domains\Domain\Models\Sessions\Session;

final readonly class RestoreSessionAction
{
    public function execute(Session $session): Session
    {
        $session->restore();

        return $session;
    }
}
