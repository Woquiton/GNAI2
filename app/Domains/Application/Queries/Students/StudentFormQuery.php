<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Students;

use App\Domains\Domain\Enums\People\Gender;
use App\Domains\Domain\Enums\Students\StudentFollowUpType;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\Models\Students\Student;

final class StudentFormQuery
{
    /**
     * @return array<string, mixed>
     */
    public function forCreation(): array
    {
        return $this->formOptions() + [
            'defaultGender' => Gender::NOT_SPECIFIED->value,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function forUpdate(Student $student): array
    {
        return $this->formOptions() + [
            'student' => $student->loadMissing('person'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'defaultStatus' => StudentStatus::ACTIVE->value,
            'followUpTypes' => collect(StudentFollowUpType::cases())->mapWithKeys(
                static fn (StudentFollowUpType $type): array => [$type->value => $type->label()],
            )->all(),
            'genders' => collect(Gender::cases())
                ->mapWithKeys(
                    static fn (Gender $gender): array => [
                        $gender->value => $gender->label(),
                    ],
                ),
            'studentStatuses' => collect(StudentStatus::cases())
                ->mapWithKeys(
                    static fn (StudentStatus $status): array => [
                        $status->value => $status->label(),
                    ],
                ),
        ];
    }
}
