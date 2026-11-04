<?php

declare(strict_types=1);

namespace App\Domains\Auth\UI\Presenters;

use App\Domains\Auth\Application\Services\Sessions\SessionSecurityService;
use App\Domains\Auth\Domain\DTOs\Sessions\SessionSecurityStateDTO;
use App\Domains\Auth\Domain\Models\User;
use App\Domains\Settings\Application\Queries\GetSessionSecuritySettingsQuery;

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
