<?php

declare(strict_types=1);

namespace App\Application\Queries\Sessions;

use App\Domain\Models\Session;

final class ShowSessionQuery
{
    public function execute(Session $session): Session
    {
        return $session->load(['students.person', 'professional.person', 'aeeRecord', 'pedagogicalRecord']);
    }
}
