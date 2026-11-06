<?php

declare(strict_types=1);

namespace App\Application\Queries\SupportRequests;

use App\Domain\Models\SupportRequest;

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
