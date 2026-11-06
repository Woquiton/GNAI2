<?php

declare(strict_types=1);

namespace App\Application\Queries\Students;

use App\Domain\Models\Course;
use App\Domain\Models\Deficiency;

final class StudentFilterOptionsQuery
{
    public function execute(): array
    {
        return [
            'courses' => Course::query()->orderBy('name')->get(['id', 'name']),
            'deficiencies' => Deficiency::query()->orderBy('name')->get(['id', 'name']),
        ];
    }
}
