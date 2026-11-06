<?php

declare(strict_types=1);

namespace App\Domains\Tests\Unit\Application\Policies\Backup\Backups;

use App\Domains\Application\Policies\Backup\Backups\BackupRestoreConfirmationPolicy;
use App\Domains\Domain\Exceptions\Backup\InvalidBackupRestoreConfirmation;
use Tests\TestCase;

final class BackupRestoreConfirmationPolicyTest extends TestCase
{
    public function test_it_rejects_a_missing_user(): void
    {
        $this->expectException(InvalidBackupRestoreConfirmation::class);
        $this->expectExceptionMessage('Senha incorreta. A restauração não foi executada.');

        app(BackupRestoreConfirmationPolicy::class)->ensurePasswordMatches(
            user: null,
            password: 'senha-correta',
        );
    }
}
