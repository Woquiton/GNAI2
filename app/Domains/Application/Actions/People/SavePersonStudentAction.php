<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\People;

use App\Domains\Application\Data\People\SavePersonData;
use App\Domains\Domain\DTOs\Students\CreateStudentDTO;
use App\Domains\Domain\DTOs\Students\UpdateStudentDTO;
use App\Domains\Domain\Enums\Students\StudentFollowUpType;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Students\Student;
use App\Domains\Domain\ValueObjects\Students\Registration;

final readonly class SavePersonStudentAction
{
    public function execute(Person $person, SavePersonData $data): void
    {
        $fields = $data->details['student'];
        $attributes = [
            'registration' => Registration::from($fields['registration']),
            'status' => StudentStatus::from($fields['status']),
            'followUpType' => filled($fields['follow_up_type'] ?? null)
                ? StudentFollowUpType::from($fields['follow_up_type']) : null,
            'entryDate' => $fields['entry_date'] ?? null,
        ];
        $student = $person->student;
        if ($student !== null) {
            $student->revise(new UpdateStudentDTO(...$attributes));
        } else {
            $student = Student::register($person, new CreateStudentDTO(...$attributes));
        }
        $student->save();
    }
}
