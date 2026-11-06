<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Auth;

use App\Domains\Application\Services\Auth\Sessions\SessionSecurityService;
use App\Domains\Domain\DTOs\Auth\Sessions\SessionSecurityStateDTO;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Queries\Settings\GetSessionSecuritySettingsQuery;

final readonly class SessionSecurityPresenter
{
    public function __construct(
        private SessionSecurityService $security,
        private GetSessionSecuritySettingsQuery $settings,
    ) {}

    public function home(User $user): string
    {
        return route(
            $user->teacher_id !== null && $user->professional_id === null && ! $user->isAdmin()
                ? 'teacher-portal.index' : 'dashboard',
            absolute: false,
        );
    }

    public function login(User $user): string
    {
        return route(
            $user->teacher_id !== null && ! $user->hasUsablePassword() ? 'teacher-access.request' : 'login',
            absolute: false,
        );
    }

    public function present(User $user, SessionSecurityStateDTO $state): array
    {
        $settings = $this->settings->execute();

        return [
            'locked' => $state->locked,
            'expired' => $state->expired,
            'canLock' => $this->security->canLock($user),
            'loginHref' => $this->login($user),
            'lockAfter' => $settings->lockAfter * 60,
            'logoutAfter' => $settings->logoutAfter * 60,
            'lastActivity' => $state->lastActivity * 1000,
            'returnTo' => $state->returnTo ?? $this->home($user),
        ];
    }
}
