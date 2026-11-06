<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Auth\Profiles;

use App\Domains\Domain\Exceptions\Auth\InvalidProfile;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Professionals\Professional;
use App\Domains\Domain\Models\Teachers\Teacher;

final readonly class EditProfileQuery
{
    /**
     * @return array{person: Person, professional: ?Professional, teacher: ?Teacher}
     *
     * @throws InvalidProfile
     */
    public function execute(User $user): array
    {
        $this->ensureCanManageProfile($user);

        $user->loadMissing(['professional.person', 'professional.position', 'teacher.person']);

        $person = $user->professional?->person ?? $user->teacher?->person;

        if (! $person instanceof Person) {
            throw new InvalidProfile('Vínculo de pessoa não encontrado para este usuário.');
        }

        $person->append('photo_url');

        return [
            'person' => $person,
            'professional' => $user->professional,
            'teacher' => $user->teacher,
        ];
    }

    /**
     * @throws InvalidProfile
     */
    private function ensureCanManageProfile(User $user): void
    {
        if ($user->is_admin && ! $user->professional_id) {
            throw new InvalidProfile(
                'Administradores sem vínculo profissional não possuem perfil de dados pessoais para edição.'
            );
        }
    }
}
