<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\People;

use App\Domains\Application\Data\People\SavePersonData;
use App\Domains\Domain\DTOs\Guardians\CreateGuardianDTO;
use App\Domains\Domain\DTOs\Guardians\UpdateGuardianDTO;
use App\Domains\Domain\Enums\Guardians\GuardianRelationship;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Support\Facades\Gate;

final readonly class SavePersonGuardiansAction
{
    public function execute(Person $person, SavePersonData $data, User $actor): void
    {
        $links = $data->details['guardian']['links'];
        $person->ensureGuardianLinksArePreserved(array_map(
            fn (array $link): int => (int) $link['student_id'],
            $links,
        ));
        foreach ($links as $link) {
            $student = Student::query()->lockForUpdate()->findOrFail($link['student_id']);
            $guardian = $person->guardians->firstWhere('student_id', $student->getKey());
            $relationship = GuardianRelationship::from($link['relationship']);
            if ($guardian !== null) {
                $guardian->revise(new UpdateGuardianDTO(relationship: $relationship));
            } else {
                Gate::forUser($actor)->authorize('guardian.create');
                $guardian = Guardian::register($student, $person, new CreateGuardianDTO(relationship: $relationship));
            }
            $guardian->save();
        }
    }
}
