<?php

declare(strict_types=1);

namespace App\Domains\Application\Resolvers\Auth;

use App\Domains\Domain\Models\Auth\User;
use Illuminate\Http\Request;

final readonly class AuthenticatedUserResolver
{
    public function fromRequest(Request $request): User
    {
        $user = $request->user();

        abort_unless($user instanceof User, 403);

        return $user;
    }
}
