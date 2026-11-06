<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Guardians;

use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\People\Person;

final class PersonHasOtherRolesQuery
{
    public function execute(Person $person, Guardian $guardian): bool
    {
        return $person->student()->exists()
            || $person->professional()->exists()
            || $person->teacher()->exists()
            || Guardian::query()
                ->where('person_id', $person->getKey())
                ->whereKeyNot($guardian->getKey())
                ->exists();
    }
}
