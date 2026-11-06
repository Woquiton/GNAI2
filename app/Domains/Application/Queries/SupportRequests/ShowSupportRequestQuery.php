<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\SupportRequests;

use App\Domains\Domain\Models\SupportRequests\SupportRequest;

final class ShowSupportRequestQuery
{
    public function execute(SupportRequest $record): SupportRequest
    {
        return $record->load([
            'student.person',
            'course',
            'reasonProfiles',
            'student.studentCourses.course',
            'creator.professional.person',
            'creator.teacher.person',
            'attachments',
        ]);
    }
}
