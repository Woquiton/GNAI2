<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Guardians;

use App\Domains\Application\Data\Guardians\CreateGuardianData;
use App\Domains\Domain\DTOs\Guardians\CreateGuardianDTO;
use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Infrastructure\Storage\Guardians\GuardianPhotoStorage;
use App\Domains\Domain\DTOs\People\CreatePersonDTO;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\ValueObjects\People\Cpf;
use App\Domains\Domain\ValueObjects\People\Phone;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateGuardianAction
{
    public function __construct(
        private GuardianPhotoStorage $photoStorage,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Student $student, CreateGuardianData $data): Guardian
    {
        $photoPath = $data->photo !== null
            ? $this->photoStorage->store($data->photo)
            : null;

        try {
            return DB::transaction(function () use ($student, $data, $photoPath): Guardian {
                $lockedStudent = Student::query()
                    ->lockForUpdate()
                    ->findOrFail($student->getKey());
                $lockedStudent->ensureIsActive();

                $personDTO = new CreatePersonDTO(
                    name: $data->name,
                    birthDate: $data->birthDate,
                    gender: $data->gender,
                    document: Cpf::fromNullable($data->document),
                    email: $data->email,
                    phone: Phone::from($data->phone),
                    address: $data->address,
                    photo: $photoPath,
                );

                $person = Person::register($personDTO);
                $person->save();

                $guardianDTO = new CreateGuardianDTO(
                    relationship: $data->relationship,
                );

                $guardian = Guardian::register($lockedStudent, $person, $guardianDTO);
                $guardian->save();

                return $guardian->load(['person', 'student.person']);
            });
        } catch (Throwable $exception) {
            $this->photoStorage->delete($photoPath);

            throw $exception;
        }
    }
}
