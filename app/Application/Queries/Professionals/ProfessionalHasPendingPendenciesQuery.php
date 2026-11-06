<?php

declare(strict_types=1);

namespace App\Application\Queries\Professionals;

use App\Domain\Models\Professional;
use Illuminate\Support\Facades\DB;

final class ProfessionalHasPendingPendenciesQuery
{
    public function execute(Professional $professional): bool
    {
        return DB::table('pendencies')
            ->where('assigned_to', $professional->getKey())
            ->where('is_completed', false)
            ->exists();
    }
}
