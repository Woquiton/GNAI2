<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Actions\Sessions;

use App\Domains\Auth\Application\Data\Sessions\UnlockSessionData;
use App\Domains\Auth\Application\Services\Sessions\SessionSecurityService;
use App\Domains\Auth\Domain\DTOs\Sessions\SessionSecurityStateDTO;
use App\Domains\Auth\Domain\Exceptions\InactiveProfessionalAccount;
use App\Domains\Auth\Domain\Exceptions\InvalidSessionUnlock;
use App\Domains\Auth\Domain\Exceptions\UserWithoutAccess;
use App\Domains\Auth\Domain\Models\User;
use App\Shared\Application\Exceptions\AccessDeniedException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

final readonly class UnlockSessionAction
{
    public function __construct(private SessionSecurityService $security) {}

    /**
     * @throws InvalidSessionUnlock
     * @throws AccessDeniedException
     */
    public function execute(User $user, UnlockSessionData $data, string $ip): SessionSecurityStateDTO
    {
        if (! $this->security->canLock($user)) {
            throw new AccessDeniedException('Esta sessão não pode ser desbloqueada com senha.');
        }

        return $this->security->update($user, function (SessionSecurityStateDTO $state) use ($user, $data, $ip) {
            $key = 'unlock-session:'.$user->getAuthIdentifier().':'.$ip;
            if (RateLimiter::tooManyAttempts($key, 5)) {
                throw InvalidSessionUnlock::tooManyAttempts();
            }
            if (! Hash::check($data->password, $user->getAuthPassword())) {
                RateLimiter::hit($key, 60);
                throw InvalidSessionUnlock::incorrectPassword();
            }
            if (! $user->canAccessSystem()) {
                throw UserWithoutAccess::make();
            }
            if ($user->professional?->status === 'inactive') {
                throw InactiveProfessionalAccount::make();
            }
            // Reavalia o prazo depois da verificação de senha, ainda sob o mesmo lock.
            $current = $this->security->current($user);
            if ($current->expired) {
                return $current;
            }
            RateLimiter::clear($key);

            return new SessionSecurityStateDTO(lastActivity: time(), returnTo: $state->returnTo);
        });
    }
}
