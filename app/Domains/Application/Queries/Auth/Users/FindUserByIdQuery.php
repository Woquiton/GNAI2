<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Auth\Users;

use App\Domains\Domain\Models\Auth\User;

class FindUserByIdQuery
{
    public function execute(int $id): ?User
    {
        return User::query()->find($id);
    }
}
