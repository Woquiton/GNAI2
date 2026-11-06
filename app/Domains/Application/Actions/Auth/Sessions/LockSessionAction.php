<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Sessions;

use App\Domains\Application\Data\Auth\Sessions\SessionActivityData;
use App\Domains\Application\Services\Auth\Sessions\SessionSecurityService;
use App\Domains\Domain\DTOs\Auth\Sessions\SessionSecurityStateDTO;
use App\Domains\Domain\Models\Auth\User;
use App\Shared\Application\Exceptions\AccessDeniedException;

final readonly class LockSessionAction
{
    public function __construct(
        private SessionSecurityService $security,
        private RememberSessionPageAction $rememberPage,
    ) {}

    public function execute(User $user, SessionActivityData $data): SessionSecurityStateDTO
    {
        if (! $this->security->canLock($user)) {
            throw new AccessDeniedException('Esta sessão não pode ser bloqueada com senha.');
        }

        $this->rememberPage->execute($user, $data->returnTo);

        return $this->security->update($user, static fn (SessionSecurityStateDTO $state) => new SessionSecurityStateDTO(
            lastActivity: $state->lastActivity,
            locked: true,
            returnTo: $state->returnTo,
        ));
    }
}
