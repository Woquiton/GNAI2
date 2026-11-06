<?php

declare(strict_types=1);

namespace App\Application\Queries\Professionals;

use App\Application\Queries\Authorship\UserHasAuthoredPedagogicalRecordsQuery;
use App\Domain\Models\Professional;
use Illuminate\Support\Facades\DB;

final readonly class ProfessionalHasLinkedRecordsQuery
{
    public function __construct(
        private UserHasAuthoredPedagogicalRecordsQuery $hasAuthoredPedagogicalRecords,
    ) {}

    public function execute(Professional $professional): bool
    {
        $professionalId = $professional->getKey();
        $userId = $professional->user()->value('id');
        $userId = $userId === null ? null : (int) $userId;

        return DB::table('attendance_sessions')->where('professional_id', $professionalId)->exists()
            || DB::table('pendencies')->where('assigned_to', $professionalId)->exists()
            || DB::table('loans')->where('professional_id', $professionalId)->exists()
            || DB::table('waitlists')->where('professional_id', $professionalId)->exists()
            || DB::table('barriers')->where('affected_professional_id', $professionalId)->exists()
            || ($userId !== null && DB::table('student_documents')->where('uploaded_by', $userId)->exists())
            || $this->hasAuthoredPedagogicalRecords->execute($userId);
    }
}
