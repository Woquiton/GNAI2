<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Sessions;

use App\Domains\Application\Data\Auth\Sessions\LoginData;
use App\Domains\Domain\DTOs\Auth\Sessions\LoginCredentialsDTO;
use App\Domains\Domain\Exceptions\Auth\InactiveProfessionalAccount;
use App\Domains\Domain\Exceptions\Auth\InvalidCredentials;
use App\Domains\Domain\Exceptions\Auth\UserWithoutAccess;
use App\Domains\Domain\Models\Auth\User;
use Illuminate\Support\Facades\Auth;

final readonly class AuthenticateUserAction
{
    /**
     * @throws InactiveProfessionalAccount
     * @throws InvalidCredentials
     * @throws UserWithoutAccess
     */
    public function execute(LoginData $data): User
    {
        $credentialsDTO = new LoginCredentialsDTO(
            email: $data->email,
            password: $data->password,
        );

        if (! Auth::attempt($credentialsDTO->toAuthCredentials())) {
            throw InvalidCredentials::make();
        }

        $user = Auth::user();

        if ($user->professional?->status === 'inactive') {
            Auth::logout();

            throw InactiveProfessionalAccount::make();
        }

        if (! $user->canAccessSystem()) {
            Auth::logout();

            throw UserWithoutAccess::make();
        }

        if (! $user->password_configured) {
            $user->forceFill(['password_configured' => true])->save();
        }

        return $user;
    }
}
