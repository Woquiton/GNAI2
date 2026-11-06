<?php

declare(strict_types=1);

namespace App\Application\Queries\AeeRecords;

use App\Domains\Auth\Domain\Models\User;
use App\Domain\Exceptions\InvalidAeeRecord;
use App\Domain\Models\AeeRecord;

final class ShowAeeRecordQuery
{
    public function execute(AeeRecord $aeeRecord, User $user): AeeRecord
    {
        $aeeRecord->load(['attendanceSession.professional.person', 'attendanceSession.students.person', 'studentEvaluations.student.person', 'studentEvaluations.guardians.person']);
        if (! $user->can('aee-record.view-all') && (int) $aeeRecord->attendanceSession->professional_id !== (int) $user->professional_id) {
            throw new InvalidAeeRecord('Você não possui permissão para visualizar este registro AEE.');
        }

        return $aeeRecord;
    }
}
