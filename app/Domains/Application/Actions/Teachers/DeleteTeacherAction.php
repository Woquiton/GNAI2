<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Teachers;

use App\Domains\Application\Queries\Auth\UserHasAuthoredPedagogicalRecordsQuery;
use App\Domains\Domain\Enums\People\PersonRole;
use App\Domains\Domain\Models\Teachers\Teacher;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteTeacherAction
{
    public function __construct(
        private UserHasAuthoredPedagogicalRecordsQuery $hasAuthoredPedagogicalRecords,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Teacher $teacher): void
    {
        DB::transaction(function () use ($teacher): void {
            $lockedTeacher = Teacher::query()
                ->with('person')
                ->lockForUpdate()
                ->findOrFail($teacher->getKey());

            $userId = $lockedTeacher->user()->value('id');
            $lockedTeacher->ensureCanBeDeleted(
                hasPeiDisciplines: $lockedTeacher->peiDisciplines()->exists(),
                hasAuthoredPedagogicalRecords: $this->hasAuthoredPedagogicalRecords->execute(
                    $userId === null ? null : (int) $userId,
                ),
            );

            // Um registro por vez (a cascata do banco não passa pela auditoria).
            $lockedTeacher->courseDisciplines()->get()->each->delete();
            $user = $lockedTeacher->user;
            if ($user !== null) {
                $user->detachPersonRole(PersonRole::TEACHER);
                if ($user->hasPersonProfile()) {
                    $user->save();
                } else {
                    $user->delete();
                }
            }
            $lockedTeacher->delete();
            // A pessoa permanece disponível nos demais cadastros e na central.
        });
    }
}
