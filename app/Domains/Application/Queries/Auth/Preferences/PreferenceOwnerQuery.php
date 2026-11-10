<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Auth\Preferences;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Infrastructure\Session\Auth\ImpersonationSession;

final readonly class PreferenceOwnerQuery
{
    public function __construct(private ImpersonationSession $impersonation) {}

    public function execute(?User $user): ?User
    {
        if ($user === null || ! $this->impersonation->active()) {
            return $user;
        }

        $owner = User::query()->find($this->impersonation->impersonatorId());
        abort_unless($owner instanceof User && $owner->isSuperAdmin(), 403);

        return $owner;
    }
}
