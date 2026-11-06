<?php

declare(strict_types=1);

namespace App\Application\Queries\Peis;

use App\Domains\Auth\Domain\Models\User;
use App\Application\Data\Peis\ListPeisData;
use App\Domain\Models\Pei;
use App\Domain\Models\Student;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final readonly class ListStudentPeisQuery
{
    public function __construct(
        private TeacherPeiAccessQuery $teacherAccess,
    ) {}

    public function execute(Student $student, ListPeisData $filters, ?User $user): LengthAwarePaginator
    {
        $query = Pei::query()
            ->where('student_id', $student->getKey())
            ->with(['student.person', 'semester', 'course']);

        $this->teacherAccess->scope($query, $user);

        if ($filters->semesterId !== null) {
            $query->where('semester_id', $filters->semesterId);
        }

        if ($filters->isFinished !== null && $filters->isFinished !== '') {
            $query->where('is_finished', filter_var($filters->isFinished, FILTER_VALIDATE_BOOLEAN));
        }

        if ($filters->version !== null) {
            $query->where('version', $filters->version);
        }

        return $query
            ->latest()
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
