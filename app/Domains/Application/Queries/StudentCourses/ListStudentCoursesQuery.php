<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\StudentCourses;

use App\Domains\Application\Data\StudentCourses\ListStudentCoursesData;
use App\Domains\Domain\Models\StudentCourses\StudentCourse;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListStudentCoursesQuery
{
    /**
     * @return LengthAwarePaginator<int, StudentCourse>
     */
    public function execute(Student $student, ListStudentCoursesData $filters): LengthAwarePaginator
    {
        return StudentCourse::query()
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ))
            ->with(['course', 'semester'])
            ->where('student_id', $student->getKey())
            ->when($filters->courseId !== null, static function ($query) use ($filters): void {
                $query->where('course_id', $filters->courseId);
            })
            ->when(filled($filters->academicYear), static function ($query) use ($filters): void {
                $query->where('academic_year', 'like', '%'.trim((string) $filters->academicYear).'%');
            })
            ->when($filters->isCurrent !== null, static function ($query) use ($filters): void {
                $query->where('is_current', $filters->isCurrent);
            })
            ->orderByDesc('is_current')
            ->orderByDesc('academic_year')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
