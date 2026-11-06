<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Sessions;

use App\Domains\Application\Services\Auth\Sessions\SessionSecurityService;
use App\Domains\Domain\DTOs\Auth\Sessions\SessionSecurityStateDTO;
use App\Domains\Domain\Models\Auth\User;

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
