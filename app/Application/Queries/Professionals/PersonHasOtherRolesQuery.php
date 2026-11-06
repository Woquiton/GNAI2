<?php

declare(strict_types=1);

namespace App\Application\Queries\Professionals;

use App\Domain\Models\Person;
use App\Domain\Models\Professional;

final class PersonHasOtherRolesQuery
{
    public function execute(Person $person, Professional $professional): bool
    {
        return $person->student()->exists()
            || $person->teacher()->exists()
            || $person->guardians()->exists()
            || Professional::query()
                ->where('person_id', $person->getKey())
                ->whereKeyNot($professional->getKey())
                ->exists();
    }
}
