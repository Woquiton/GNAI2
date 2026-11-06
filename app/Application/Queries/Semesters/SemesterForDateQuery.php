<?php

declare(strict_types=1);

namespace App\Application\Queries\Semesters;

use App\Domain\Models\Semester;
use Carbon\CarbonImmutable;
use DateTimeInterface;

final class SemesterForDateQuery
{
    /** Sem correspondência única, não atribui um semestre por aproximação. */
    public function execute(DateTimeInterface|string|null $date): ?int
    {
        if ($date === null) {
            return null;
        }

        $day = CarbonImmutable::parse($date)->toDateString();
        $ids = Semester::query()
            ->where('start_date', '<=', $day)
            ->where('end_date', '>=', $day)
            ->limit(2)
            ->pluck('id');

        return $ids->count() === 1 ? (int) $ids->first() : null;
    }
}
