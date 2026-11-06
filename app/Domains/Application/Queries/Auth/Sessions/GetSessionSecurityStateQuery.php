<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Auth\Sessions;

use App\Domains\Application\Services\Auth\Sessions\SessionSecurityService;
use App\Domains\Domain\DTOs\Auth\Sessions\SessionSecurityStateDTO;
use App\Domains\Domain\Models\Auth\User;

final readonly class GetSessionSecurityStateQuery
{
    public function __construct(private SessionSecurityService $security) {}

    public function execute(User $user): SessionSecurityStateDTO
    {
        return $this->security->current($user);
    }
}
