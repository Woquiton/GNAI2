<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\Backup;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Actions\Backup\StoreUploadedBackupAction;
use App\Domains\Application\Contracts\Backup\BackupArchiveStorageContract;
use App\Domains\Application\Data\Backup\UploadBackupData;
use App\Domains\Domain\Enums\Backup\BackupStatus;
use App\Domains\Domain\Exceptions\Backup\BackupOperationFailed;
use App\Domains\Tests\Fakes\Backup\FakeBackupArchiveStorage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

final class StoreUploadedBackupActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_stores_uploaded_backup_with_responsible_user(): void
    {
        $user = User::factory()->create();
        $storage = new FakeBackupArchiveStorage;

        $this->app->instance(BackupArchiveStorageContract::class, $storage);

        $backup = app(StoreUploadedBackupAction::class)->execute(
            new UploadBackupData(
                backupFile: UploadedFile::fake()->create('manual.zip', 1, 'application/zip'),
            ),
            $user->id,
        );

        $this->assertDatabaseHas('backups', [
            'id' => $backup->id,
            'file_name' => 'uploaded-backup-test.zip',
            'file_path' => 'GNAIbackups/uploaded-backup-test.zip',
            'status' => BackupStatus::SUCCESS->value,
            'user_id' => $user->id,
        ]);
    }

    public function test_it_requires_a_responsible_user_for_upload(): void
    {
        $this->app->instance(BackupArchiveStorageContract::class, new FakeBackupArchiveStorage);

        $this->expectException(BackupOperationFailed::class);
        $this->expectExceptionMessage('Não foi possível identificar o usuário responsável pelo upload do backup.');

        app(StoreUploadedBackupAction::class)->execute(
            new UploadBackupData(
                backupFile: UploadedFile::fake()->create('manual.zip', 1, 'application/zip'),
            ),
        );
    }
}
