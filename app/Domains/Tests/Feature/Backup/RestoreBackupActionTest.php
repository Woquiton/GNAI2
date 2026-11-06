<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\Backup;

use App\Domains\Application\Actions\Backup\RestoreBackupAction;
use App\Domains\Application\Contracts\Backup\BackupArchiveStorageContract;
use App\Domains\Domain\DTOs\Backup\CreateBackupDTO;
use App\Domains\Domain\Enums\Backup\BackupStatus;
use App\Domains\Domain\Models\Backup\Backup;
use App\Domains\Tests\Fakes\Backup\FakeBackupArchiveStorage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class RestoreBackupActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_restores_a_successful_backup(): void
    {
        $backup = Backup::register(new CreateBackupDTO(
            fileName: 'backup.zip',
            filePath: 'GNAIbackups/backup.zip',
            size: '1 MB',
            status: BackupStatus::SUCCESS,
        ));
        $backup->save();

        $storage = new FakeBackupArchiveStorage;
        $storage->backupArchiveExists = true;

        $this->app->instance(BackupArchiveStorageContract::class, $storage);

        app(RestoreBackupAction::class)->execute($backup);

        self::assertTrue($storage->restoreWasCalled);
    }
}
