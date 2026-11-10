<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Students;

use App\Domains\Application\Data\Students\ListStudentsData;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class ListStudentsQuery
{
    /**
     * @return LengthAwarePaginator<int, Student>
     */
    public function execute(ListStudentsData $filters, ?int $teacherId = null): LengthAwarePaginator
    {
        $query = Student::query()
            ->when($filters->createdFrom, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '>=', $filters->createdFrom,
            ))
            ->when($filters->createdTo, fn ($query) => $query->whereDate(
                $query->getModel()->qualifyColumn('created_at'), '<=', $filters->createdTo,
            ))
            ->select('students.*')
            ->join('people', 'people.id', '=', 'students.person_id')
            ->with(['person', 'currentCourse.course']);

        if ($teacherId !== null) {
            // Professores veem os alunos matriculados hoje nos cursos em que lecionam no semestre atual.
            $query->whereHas('studentCourses', function (Builder $enrollments) use ($teacherId): void {
                $enrollments
                    ->where('is_current', true)
                    ->whereIn('course_id', function ($assignments) use ($teacherId): void {
                        $assignments
                            ->select('course_id')
                            ->from('teacher_course_disciplines')
                            ->where('teacher_id', $teacherId)
                            ->whereIn('semester_id', function ($semesters): void {
                                $semesters->select('id')->from('semesters')->where('is_current', true);
                            });
                    });
            });
        }

        if (filled($filters->name)) {
            $query->where('people.name', 'like', trim($filters->name).'%');
        }

        if (filled($filters->phone)) {
            $query->where('people.phone', 'like', '%'.$filters->phone.'%');
        }

        if (filled($filters->email)) {
            $query->where('people.email', 'like', '%'.trim($filters->email).'%');
        }

        if (filled($filters->registration)) {
            $query->where('students.registration', 'like', '%'.trim($filters->registration).'%');
        }

        if ($filters->status !== null) {
            $query->where('students.status', $filters->status->value);
        }

        if ($filters->followUpType === 'not_informed') {
            $query->whereNull('students.follow_up_type');
        } elseif (filled($filters->followUpType)) {
            $query->where('students.follow_up_type', $filters->followUpType);
        }

        if ($filters->courseId === 0) {
            $query->whereDoesntHave('currentCourse');
        } elseif ($filters->courseId !== null) {
            $query->whereHas(
                'currentCourse',
                fn (Builder $courseQuery): Builder => $courseQuery->where('course_id', $filters->courseId),
            );
        }

        if (filled($filters->deficiencyId)) {
            $profileIds = array_map('intval', explode(',', $filters->deficiencyId));
            $withoutProfile = in_array(0, $profileIds, true);
            $profileIds = array_values(array_filter($profileIds, fn (int $id): bool => $id !== 0));
            $query->where(function (Builder $profiles) use ($profileIds, $withoutProfile): void {
                if ($profileIds !== []) {
                    $profiles->whereHas(
                        'deficiencies',
                        fn (Builder $related) => $related->whereIn('deficiencies.id', $profileIds),
                    );
                }
                if ($withoutProfile) {
                    $profiles->orWhereDoesntHave('deficiencies');
                }
            });
        }

        return $query
            ->orderBy('people.name')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
