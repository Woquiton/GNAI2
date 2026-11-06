<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Students;

use App\Domains\Domain\DTOs\People\CreatePersonDTO;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\ValueObjects\People\Cpf;
use App\Domains\Domain\ValueObjects\People\Phone;
use App\Domains\Application\Data\Students\CreateStudentData;
use App\Domains\Domain\DTOs\Students\CreateStudentDTO;
use App\Domains\Domain\Models\Students\Student;
use App\Domains\Domain\ValueObjects\Students\Registration;
use App\Domains\Infrastructure\Storage\Students\StudentPhotoStorage;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateStudentAction
{
    public function __construct(
        private StudentPhotoStorage $photoStorage,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(CreateStudentData $data): Student
    {
        $photoPath = $data->photo !== null
            ? $this->photoStorage->store($data->photo)
            : null;

        try {
            return DB::transaction(function () use ($data, $photoPath): Student {
                $personDTO = new CreatePersonDTO(
                    name: $data->name,
                    birthDate: $data->birthDate,
                    gender: $data->gender,
                    document: Cpf::fromNullable($data->document),
                    email: $data->email,
                    phone: Phone::fromNullable($data->phone),
                    address: $data->address,
                    photo: $photoPath,
                );

                $person = Person::register($personDTO);
                $person->save();

                $studentDTO = new CreateStudentDTO(
                    registration: Registration::from($data->registration),
                    followUpType: $data->followUpType,
                    entryDate: $data->entryDate,
                    status: $data->status,
                );

                $student = Student::register($person, $studentDTO);
                $student->save();

                return $student->load('person');
            });
        } catch (Throwable $exception) {
            $this->photoStorage->delete($photoPath);

            throw $exception;
        }
    }
}
