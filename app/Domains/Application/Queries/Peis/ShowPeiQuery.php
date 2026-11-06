<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Peis;

use App\Domains\Domain\Models\Peis\Pei;

final class ShowPeiQuery
{
    public function execute(Pei $pei): Pei
    {
        return $pei->load([
            'student.person',
            'student.deficiencies',
            'paee',
            'course',
            'semester',
            'creator',
        ]);
    }
}
