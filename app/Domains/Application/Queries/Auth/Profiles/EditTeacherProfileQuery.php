<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Auth\Profiles;

use App\Domains\Domain\Exceptions\Auth\InvalidProfile;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\People\Person;

final readonly class EditTeacherProfileQuery
{
    public function execute(User $user): array
    {
        $person = $user->teacher?->person;
        if (! $person instanceof Person) {
            throw new InvalidProfile('Vínculo de professor não encontrado para este usuário.');
        }

        return [
            'person' => $person->only(['id', 'name', 'photo', 'photo_url']),
            'email' => $user->email,
        ];
    }
}
