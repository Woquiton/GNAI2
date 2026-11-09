<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\People;

use App\Domains\Domain\Enums\People\PersonRole;
use App\Domains\Domain\Models\People\Person;

final class PersonPagePresenter
{
    public function listRow(Person $person): array
    {
        return [
            'id' => $person->getKey(),
            'name' => $person->name,
            'email' => $person->email,
            'phone' => $person->phone,
            'roles' => array_map(fn (PersonRole $role): string => $role->label(), $person->registeredRoles()),
            'tags' => $person->tags->pluck('name')->all(),
        ];
    }

    public function person(Person $person): array
    {
        return [
            'id' => $person->getKey(),
            'name' => $person->name,
            'document' => $person->document,
            'birth_date' => $person->birth_date->format('Y-m-d'),
            'gender' => $person->gender->value,
            'email' => $person->email,
            'phone' => $person->phone,
            'address' => $person->address,
            'photo_url' => $person->photo_url,
            'student' => $person->student === null ? null : [
                'registration' => $person->student->registration,
                'entry_date' => $person->student->entry_date?->format('Y-m-d'),
                'status' => $person->student->status->value,
                'follow_up_type' => $person->student->follow_up_type?->value,
            ],
            'teacher' => $person->teacher === null ? null : [
                'registration' => $person->teacher->registration,
            ],
            'professional' => $person->professional === null ? null : [
                'registration' => $person->professional->registration,
                'entry_date' => $person->professional->entry_date->format('Y-m-d'),
                'status' => $person->professional->status->value,
                'position_id' => $person->professional->position_id,
                'show_on_website' => $person->professional->show_on_website,
            ],
            'guardians' => $person->guardians->map(fn ($guardian): array => [
                'student_id' => $guardian->student_id,
                'relationship' => $guardian->relationship->value,
            ])->all(),
            'tags' => $person->tags->map(fn ($tag): array => [
                'id' => $tag->getKey(),
                'name' => $tag->name,
            ])->all(),
        ];
    }
}
