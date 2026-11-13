<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Sessions;

use App\Domains\Application\Actions\Audit\RecordAuditActivityAction;
use App\Domains\Application\Data\Auth\Sessions\UnlockSessionData;
use App\Domains\Application\Services\Auth\Sessions\SessionSecurityService;
use App\Domains\Domain\DTOs\Auth\Sessions\SessionSecurityStateDTO;
use App\Domains\Domain\Enums\Audit\AuditEvent;
use App\Domains\Domain\Exceptions\Auth\InactiveProfessionalAccount;
use App\Domains\Domain\Exceptions\Auth\InvalidSessionUnlock;
use App\Domains\Domain\Exceptions\Auth\UserWithoutAccess;
use App\Domains\Domain\Models\Auth\User;
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

        $unlocked = false;
        $result = $this->security->update($user, function (SessionSecurityStateDTO $state) use ($user, $data, $ip, &$unlocked) {
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
            $unlocked = $current->locked;

            return new SessionSecurityStateDTO(lastActivity: time(), returnTo: $state->returnTo);
        });

        if ($unlocked) {
            app(RecordAuditActivityAction::class)->execute(
                AuditEvent::SESSION_UNLOCKED, 'user', (string) $user->getKey(), 'sua sessão', $user,
            );
        }

        return $result;
    }
}
