<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Students;

use App\Domains\Domain\Models\Deficiencies\Deficiency;
use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\Peis\Pei;
use App\Domains\Domain\Models\StudentCourses\StudentCourse;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Database\Eloquent\Collection;

final class ShowStudentQuery
{
    public function execute(Student $student): Student
    {
        return (clone $student)->load('person');
    }

    public function status(Student $student): Student
    {
        return (clone $student)->load([
            'currentCaseStudy',
            'currentPaee',
        ]);
    }

    public function currentCourseId(Student $student): ?int
    {
        $id = $student->studentCourses()
            ->where('is_current', true)
            ->value('id');

        return $id === null ? null : (int) $id;
    }

    /** @return list<string> */
    public function profileNames(Student $student): array
    {
        return $student->deficiencies()
            ->orderBy('name')
            ->pluck('name')
            ->all();
    }

    /** @return Collection<int, StudentCourse> */
    public function studentCourses(Student $student): Collection
    {
        return $student->studentCourses()
            ->with(['course', 'semester'])
            ->orderByDesc('is_current')
            ->orderByDesc('academic_year')
            ->orderByDesc('id')
            ->get();
    }

    /** @return Collection<int, Deficiency> */
    public function deficiencies(Student $student): Collection
    {
        return $student->deficiencies()->get();
    }

    /** @return Collection<int, Guardian> */
    public function guardians(Student $student): Collection
    {
        return $student->guardians()
            ->with('person')
            ->latest('id')
            ->get();
    }

    /**
     * Para professores, somente os PEIs com adaptações sob sua responsabilidade.
     *
     * @return Collection<int, Pei>
     */
    public function peis(Student $student, ?int $teacherId = null): Collection
    {
        return $student->peis()
            ->when(
                $teacherId !== null,
                fn ($query) => $query->whereHas(
                    'peiDisciplines',
                    fn ($adaptations) => $adaptations->where('teacher_id', $teacherId),
                ),
            )
            ->with([
                'semester',
                'course',
                'peiDisciplines.teacher.person',
            ])
            ->latest('id')
            ->get();
    }

    /** @return Collection<int, StudentDocument> */
    public function documents(Student $student): Collection
    {
        return $student->documents()
            ->with('semester')
            ->latest('id')
            ->get();
    }
}
