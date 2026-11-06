<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\PedagogicalRecords;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Exceptions\PedagogicalRecords\InvalidPedagogicalRecord;
use App\Domains\Domain\Models\PedagogicalRecords\PedagogicalRecord;

final class ShowPedagogicalRecordQuery
{
    public function execute(PedagogicalRecord $pedagogicalRecord, User $user): PedagogicalRecord
    {
        $pedagogicalRecord->load([
            'attendanceSession.students.person',
            'attendanceSession.students.currentCourse.course',
            'attendanceSession.professional.person',
            'guardians.person',
        ]);
        if (! $user->can('pedagogical-record.view-all') && (int) $pedagogicalRecord->attendanceSession->professional_id !== (int) $user->professional_id) {
            throw new InvalidPedagogicalRecord('Você não possui permissão para visualizar este registro pedagógico.');
        }

        return $pedagogicalRecord;
    }
}
