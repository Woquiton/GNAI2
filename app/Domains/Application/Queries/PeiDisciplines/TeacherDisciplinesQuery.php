<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\PeiDisciplines;

use App\Domains\Domain\Models\Peis\Pei;
use App\Domains\Domain\Models\Teachers\TeacherCourseDiscipline;
use Illuminate\Support\Collection;

final class TeacherDisciplinesQuery
{
    /**
     * @return Collection<int, array{id: int, name: string}>
     */
    public function execute(Pei $pei, int $teacherId): Collection
    {
        return TeacherCourseDiscipline::query()
            ->where('teacher_id', $teacherId)
            ->where('course_id', $pei->course_id)
            ->where('semester_id', $pei->semester_id)
            ->whereHas('discipline', function ($query): void {
                $query->where('is_active', true);
            })
            ->with('discipline')
            ->get()
            ->pluck('discipline')
            ->unique('id')
            ->sortBy('name')
            ->values()
            ->map(fn ($discipline): array => [
                'id' => (int) $discipline->id,
                'name' => (string) $discipline->name,
            ]);
    }
}
