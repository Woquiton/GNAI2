<?php

declare(strict_types=1);

namespace App\Application\Queries\Peis;

use App\Domains\Auth\Domain\Models\User;
use App\Application\Data\Peis\ListPeisData;
use App\Domain\Models\Pei;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final readonly class ListAllPeisQuery
{
    public function __construct(
        private TeacherPeiAccessQuery $teacherAccess,
    ) {}

    public function execute(ListPeisData $filters, ?User $user): LengthAwarePaginator
    {
        $query = Pei::query()
            ->with(['student.person', 'semester', 'course']);

        $this->teacherAccess->scope($query, $user);

        if ($filters->studentId !== null) {
            $query->where('student_id', $filters->studentId);
        }

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
