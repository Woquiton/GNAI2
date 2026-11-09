<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Students;

use App\Domains\Application\Queries\Students\StudentHasLinkedRecordsQuery;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteStudentAction
{
    public function __construct(
        private StudentHasLinkedRecordsQuery $hasLinkedRecords,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Student $student): void
    {
        DB::transaction(function () use ($student): void {
            $lockedStudent = Student::query()
                ->lockForUpdate()
                ->findOrFail($student->getKey());
            Person::query()
                ->lockForUpdate()
                ->findOrFail($lockedStudent->person_id);

            $lockedStudent->ensureCanBeDeleted(
                $this->hasLinkedRecords->execute($lockedStudent),
            );

            $lockedStudent->delete();

            // A identidade e a foto permanecem no cadastro central de pessoas.
        });
    }
}
