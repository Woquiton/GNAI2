<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\Backup;

use App\Domains\Application\Actions\Backup\DeleteBackupAction;
use App\Domains\Application\Contracts\Backup\BackupArchiveStorageContract;
use App\Domains\Domain\DTOs\Backup\CreateBackupDTO;
use App\Domains\Domain\Enums\Backup\BackupStatus;
use App\Domains\Domain\Models\Backup\Backup;
use App\Domains\Tests\Fakes\Backup\FakeBackupArchiveStorage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class DeleteBackupActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_deletes_backup_record_and_archive(): void
    {
        $backup = Backup::register(new CreateBackupDTO(
            fileName: 'backup.zip',
            filePath: 'GNAIbackups/backup.zip',
            size: '1 MB',
            status: BackupStatus::SUCCESS,
        ));
        $backup->save();

        $storage = new FakeBackupArchiveStorage;
        $storage->existingArchives = ['GNAIbackups/backup.zip' => true];

        $this->app->instance(BackupArchiveStorageContract::class, $storage);

        app(DeleteBackupAction::class)->execute($backup);

        $this->assertDatabaseMissing('backups', [
            'id' => $backup->id,
        ]);
        self::assertSame(['GNAIbackups/backup.zip'], $storage->deletedArchives);
    }
}
