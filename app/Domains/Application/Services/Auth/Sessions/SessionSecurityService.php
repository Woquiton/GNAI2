<?php

declare(strict_types=1);

namespace App\Domains\Application\Services\Auth\Sessions;

use App\Domains\Domain\DTOs\Auth\Sessions\SessionSecurityStateDTO;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Infrastructure\Session\Auth\ImpersonationSession;
use App\Domains\Infrastructure\Session\Auth\SessionSecurity;
use App\Domains\Application\Queries\Settings\GetSessionSecuritySettingsQuery;
use Closure;

/** Aplica os prazos e coordena as transições atômicas solicitadas pelas Actions. */
final readonly class SessionSecurityService
{
    public function __construct(
        private SessionSecurity $storage,
        private GetSessionSecuritySettingsQuery $settings,
        private ImpersonationSession $impersonation,
    ) {}

    public function canLock(User $user): bool
    {
        return $user->hasUsablePassword() && ! $this->impersonation->active();
    }

    public function current(User $user): SessionSecurityStateDTO
    {
        $settings = $this->settings->execute();
        $now = time();
        // A perda do cache de uma sessão existente exige nova autenticação.
        $state = $this->storage->load() ?? new SessionSecurityStateDTO(
            lastActivity: $this->storage->initialized() ? $now - $settings->logoutAfter * 60 : $now,
        );
        $idle = $now - $state->lastActivity;

        return new SessionSecurityStateDTO(
            lastActivity: $state->lastActivity,
            locked: $this->canLock($user) && ($state->locked || $idle >= $settings->lockAfter * 60),
            expired: $idle >= $settings->logoutAfter * 60,
            returnTo: $state->returnTo,
        );
    }

    /** @param Closure(SessionSecurityStateDTO): SessionSecurityStateDTO $transition */
    public function update(User $user, Closure $transition): SessionSecurityStateDTO
    {
        return $this->storage->synchronized(function () use ($user, $transition): SessionSecurityStateDTO {
            $state = $this->current($user);
            if (! $state->expired) {
                $state = $transition($state);
            }
            $this->storage->save($state);

            return $state;
        });
    }
}
