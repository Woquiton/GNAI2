<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Actions\Sessions;

use App\Domains\Auth\Application\Services\Sessions\SessionSecurityService;
use App\Domains\Auth\Domain\DTOs\Sessions\SessionSecurityStateDTO;
use App\Domains\Auth\Domain\Models\User;

final readonly class CheckSessionSecurityAction
{
    public function __construct(private SessionSecurityService $security) {}

    public function execute(User $user): SessionSecurityStateDTO
    {
        return $this->security->update($user, static fn (SessionSecurityStateDTO $state) => $state);
    }
}
