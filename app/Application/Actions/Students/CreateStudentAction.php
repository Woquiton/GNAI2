<?php

declare(strict_types=1);

namespace App\Application\Actions\Students;

use App\Application\Data\Students\CreateStudentData;
use App\Domain\DTOs\People\CreatePersonDTO;
use App\Domain\DTOs\Students\CreateStudentDTO;
use App\Domain\Models\Person;
use App\Domain\Models\Student;
use App\Domain\ValueObjects\Cpf;
use App\Domain\ValueObjects\Phone;
use App\Domain\ValueObjects\Registration;
use App\Infrastructure\Storage\StudentPhotoStorage;
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
