<?php

declare(strict_types=1);

namespace App\Application\Queries\StudentDeficiencies;

use App\Domain\Models\Deficiency;
use App\Domain\Models\Student;
use App\Domain\Models\StudentDeficiency;
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
