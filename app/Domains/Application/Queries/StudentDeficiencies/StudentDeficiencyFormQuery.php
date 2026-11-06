<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\StudentDeficiencies;

use App\Domains\Domain\Models\Deficiencies\Deficiency;
use App\Domains\Domain\Models\StudentDeficiencies\StudentDeficiency;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Database\Eloquent\Collection;

final class StudentDeficiencyFormQuery
{
    /**
     * @return array<string, mixed>
     */
    public function forCreation(Student $student): array
    {
        $student->ensureIsActive();
        $student->loadMissing('person');

        return [
            'student' => $student,
            'deficienciesList' => $this->activeDeficiencies(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function forUpdate(Student $student, StudentDeficiency $studentDeficiency): array
    {
        $student->ensureIsActive();
        $student->loadMissing('person');
        $studentDeficiency->loadMissing('deficiency');

        return [
            'student' => $student,
            'student_deficiency' => $studentDeficiency,
        ];
    }

    /**
     * @return Collection<int, Deficiency>
     */
    private function activeDeficiencies(): Collection
    {
        return Deficiency::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }
}
