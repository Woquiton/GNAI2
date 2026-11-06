<?php

declare(strict_types=1);

namespace App\Application\Queries\Professionals;

use App\Domain\Models\Professional;
use Illuminate\Support\Facades\DB;

final class ProfessionalHasSessionsQuery
{
    public function execute(Professional $professional): bool
    {
        return DB::table('attendance_sessions')
            ->where('professional_id', $professional->getKey())
            ->whereNull('deleted_at')
            ->exists();
    }
}
