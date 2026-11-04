<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Actions\Sessions;

use App\Domains\Auth\Application\Services\Sessions\SessionSecurityService;
use App\Domains\Auth\Domain\DTOs\Sessions\SessionSecurityStateDTO;
use App\Domains\Auth\Domain\Models\User;

final readonly class RecordSessionActivityAction
{
    public function __construct(
        private SessionSecurityService $security,
        private RememberSessionPageAction $rememberPage,
    ) {}

    public function execute(User $user, ?string $returnTo): SessionSecurityStateDTO
    {
        $this->rememberPage->execute($user, $returnTo);

        return $this->security->update($user, static fn (SessionSecurityStateDTO $state) => new SessionSecurityStateDTO(
            lastActivity: $state->locked ? $state->lastActivity : time(),
            locked: $state->locked,
            returnTo: $state->returnTo,
        ));
    }
}
