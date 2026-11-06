<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Students;

use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Domain\Models\Deficiencies\Deficiency;

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
