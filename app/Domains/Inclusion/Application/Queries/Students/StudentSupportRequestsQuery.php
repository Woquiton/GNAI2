<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\Students;

use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\Domain\Models\SupportRequest;
use Illuminate\Database\Eloquent\Collection;

final class StudentSupportRequestsQuery
{
    public function exists(Student $student): bool
    {
        return $student->supportRequests()->exists();
    }

    /** @return Collection<int, SupportRequest> */
    public function execute(Student $student): Collection
    {
        return $student->supportRequests()
            ->with([
                'student.person',
                'creator.professional.person',
                'creator.teacher.person',
            ])
            ->orderByDesc('request_date')
            ->orderByDesc('id')
            ->get();
    }
}
