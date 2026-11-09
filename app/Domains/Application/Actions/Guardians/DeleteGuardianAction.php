<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Guardians;

use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteGuardianAction
{
    /**
     * @throws Throwable
     */
    public function execute(Student $student, Guardian $guardian): void
    {
        DB::transaction(function () use ($student, $guardian): void {
            $lockedStudent = Student::query()
                ->lockForUpdate()
                ->findOrFail($student->getKey());
            $lockedGuardian = Guardian::query()
                ->lockForUpdate()
                ->findOrFail($guardian->getKey());
            $lockedGuardian->ensureBelongsTo($lockedStudent);
            $lockedGuardian->ensureCanBeDeleted();

            Person::query()
                ->lockForUpdate()
                ->findOrFail($lockedGuardian->person_id);

            $lockedGuardian->delete();

            // A identidade e a foto permanecem no cadastro central de pessoas.
        });
    }
}
