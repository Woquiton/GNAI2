<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Guardians;

use App\Domains\Application\Queries\Guardians\PersonHasOtherRolesQuery;
use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Infrastructure\Storage\Guardians\GuardianPhotoStorage;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteGuardianAction
{
    public function __construct(
        private PersonHasOtherRolesQuery $hasOtherRoles,
        private GuardianPhotoStorage $photoStorage,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Student $student, Guardian $guardian): void
    {
        $photoPath = DB::transaction(function () use ($student, $guardian): ?string {
            $lockedStudent = Student::query()
                ->lockForUpdate()
                ->findOrFail($student->getKey());
            $lockedGuardian = Guardian::query()
                ->lockForUpdate()
                ->findOrFail($guardian->getKey());
            $lockedGuardian->ensureBelongsTo($lockedStudent);
            $lockedGuardian->ensureCanBeDeleted();

            $person = Person::query()
                ->lockForUpdate()
                ->findOrFail($lockedGuardian->person_id);
            $personHasOtherRoles = $this->hasOtherRoles->execute($person, $lockedGuardian);

            $lockedGuardian->delete();

            if ($personHasOtherRoles) {
                return null;
            }

            $photoPath = $person->getRawOriginal('photo');
            $person->delete();

            return $photoPath;
        });

        $this->photoStorage->delete($photoPath);
    }
}
