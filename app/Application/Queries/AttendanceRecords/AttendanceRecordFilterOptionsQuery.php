<?php

declare(strict_types=1);

namespace App\Application\Queries\AttendanceRecords;

use App\Domain\Models\Course;
use App\Domain\Models\Professional;
use App\Domain\Models\Student;

final class AttendanceRecordFilterOptionsQuery
{
    public function execute(): array
    {
        return [
            'students' => Student::query()->with('person')->orderBy('id')->get(['id', 'person_id']),
            'professionals' => Professional::query()->with('person')->get()->sortBy(fn ($professional) => $professional->person->name ?? '')->values(),
            'courses' => Course::query()->orderBy('name')->get(['id', 'name']),
        ];
    }
}
