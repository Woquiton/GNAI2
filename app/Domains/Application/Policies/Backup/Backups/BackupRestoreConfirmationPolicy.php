<?php

declare(strict_types=1);

namespace App\Domains\Application\Policies\Backup\Backups;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Exceptions\Backup\InvalidBackupRestoreConfirmation;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Hash;

final readonly class BackupRestoreConfirmationPolicy
{
    /**
     * @throws InvalidBackupRestoreConfirmation
     */
    public function ensurePasswordMatches(?Authenticatable $user, string $password): void
    {
        if (! $user instanceof User || ! Hash::check($password, $user->password)) {
            throw new InvalidBackupRestoreConfirmation(
                'Senha incorreta. A restauração não foi executada.'
            );
        }
    }
}
