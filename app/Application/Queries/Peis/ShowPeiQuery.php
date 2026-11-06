<?php

declare(strict_types=1);

namespace App\Application\Queries\Peis;

use App\Domain\Models\Pei;

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
