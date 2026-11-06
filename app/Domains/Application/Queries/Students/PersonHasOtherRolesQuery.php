<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Students;

use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Students\Student;

final class PersonHasOtherRolesQuery
{
    public function execute(Person $person, Student $student): bool
    {
        return Student::query()
            ->where('person_id', $person->getKey())
            ->whereKeyNot($student->getKey())
            ->exists()
            || $person->professional()->exists()
            || $person->teacher()->exists()
            || $person->guardians()->exists();
    }
}
