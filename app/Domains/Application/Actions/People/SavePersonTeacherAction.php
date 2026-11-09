<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\People;

use App\Domains\Application\Data\People\SavePersonData;
use App\Domains\Domain\DTOs\Teachers\CreateTeacherDTO;
use App\Domains\Domain\DTOs\Teachers\UpdateTeacherDTO;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Teachers\Teacher;
use App\Domains\Domain\ValueObjects\Students\Registration;

final readonly class SavePersonTeacherAction
{
    public function execute(Person $person, SavePersonData $data): void
    {
        $registration = Registration::from($data->details['teacher']['registration']);
        $teacher = $person->teacher;
        if ($teacher !== null) {
            $teacher->revise(new UpdateTeacherDTO(registration: $registration));
        } else {
            $teacher = Teacher::register(new CreateTeacherDTO(
                personId: (int) $person->getKey(),
                registration: $registration,
            ));
        }
        $teacher->save();
    }
}
