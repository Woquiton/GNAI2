<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\People;

use App\Domains\Application\Policies\Auth\AdministratorAccessPolicy;
use App\Domains\Application\Queries\People\PersonAccessAccountsQuery;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\People\Person;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

final readonly class SavePersonAccessAction
{
    public function __construct(
        private PersonAccessAccountsQuery $accounts,
        private AdministratorAccessPolicy $administratorAccess,
    ) {}

    /** Retorna a conta que precisa receber o link de definição de senha. */
    public function execute(Person $person, User $actor): ?User
    {
        if (! $person->teacher && ! $person->professional) {
            return null;
        }
        $accounts = $this->accounts->execute($person, lock: true);
        $person->ensureHasSingleAccessAccount($accounts->count());
        $user = $accounts->first();
        $needsPasswordSetup = $user === null
            || (! $user->hasUsablePassword() && $person->professional !== null);
        if ($user !== null) {
            $this->administratorAccess->ensureCanChangeEmail($actor, $user, (string) $person->email);
        } else {
            $user = new User([
                'password' => Hash::make(Str::random(40)),
                'is_admin' => false,
                'password_configured' => false,
            ]);
        }
        $user->linkToPerson($person);
        $user->save();

        return $needsPasswordSetup ? $user : null;
    }
}
