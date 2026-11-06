<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Sessions;

use App\Domains\Domain\Models\Sessions\Session;

final class ShowSessionQuery
{
    public function execute(Session $session): Session
    {
        return $session->load(['students.person', 'professional.person', 'aeeRecord', 'pedagogicalRecord']);
    }
}
