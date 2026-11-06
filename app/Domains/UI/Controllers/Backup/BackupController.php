<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Backup;

use App\Domains\Application\Actions\Backup\DeleteBackupAction;
use App\Domains\Application\Actions\Backup\GenerateBackupAction;
use App\Domains\Application\Actions\Backup\RestoreBackupAction;
use App\Domains\Application\Actions\Backup\StoreUploadedBackupAction;
use App\Domains\Application\Actions\Backup\SyncBackupsAction;
use App\Domains\Application\Data\Backup\ListBackupsData;
use App\Domains\Application\Data\Backup\UploadBackupData;
use App\Domains\Application\Policies\Backup\Backups\BackupRestoreConfirmationPolicy;
use App\Domains\Application\Queries\Backup\DownloadBackupQuery;
use App\Domains\Application\Queries\Backup\ListBackupsQuery;
use App\Domains\Application\Queries\Backup\ListBackupUsersQuery;
use App\Domains\Application\Queries\Backup\ShowBackupQuery;
use App\Domains\Domain\Exceptions\Backup\BackupOperationFailed;
use App\Domains\Domain\Exceptions\Backup\InvalidBackup;
use App\Domains\Domain\Exceptions\Backup\InvalidBackupRestoreConfirmation;
use App\Domains\Domain\Models\Backup\Backup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final class BackupController
{
    public function index(
        ListBackupsData $filters,
        ListBackupsQuery $backupsQuery,
        ListBackupUsersQuery $usersQuery,
        SyncBackupsAction $syncBackups,
        Request $request,
    ): InertiaResponse {
        $syncBackups->execute();

        $backups = $backupsQuery->execute($filters);
        $backups->getCollection()->each(
            fn (Backup $backup) => $backup->setAttribute(
                'created_at_label',
                $backup->created_at?->format('d/m/Y H:i') ?? 'Não informado',
            ),
        );
        $users = $usersQuery->execute()
            ->map(fn ($user): array => ['id' => $user->id, 'name' => $user->name])
            ->values();

        return Inertia::render('Backup/Index', [
            'backups' => $backups,
            'users' => $users,
            'filters' => [
                'name' => $filters->name ?? '',
                'status' => $filters->status?->value ?? '',
                'user_id' => $filters->userId === null ? '' : (string) $filters->userId,
            ],
            'backupDirectory' => config('backup.backup.name'),
            'can' => [
                'store' => $request->user()->can('backup.store'),
                'upload' => $request->user()->can('backup.upload'),
                'show' => $request->user()->can('backup.show'),
                'download' => $request->user()->can('backup.download'),
                'restore' => $request->user()->can('backup.restore'),
                'destroy' => $request->user()->can('backup.destroy'),
            ],
        ]);
    }

    /**
     * @throws BackupOperationFailed
     */
    public function store(GenerateBackupAction $action): RedirectResponse
    {
        $action->execute();

        return redirect()
            ->route('backup.backups.index')
            ->with('success', 'Backup realizado com sucesso!');
    }

    public function show(Backup $backup, ShowBackupQuery $query, Request $request): InertiaResponse
    {
        $backup = $query->execute($backup);
        $backup->setAttribute('created_at_label', $backup->created_at?->format('d/m/Y H:i') ?? 'Não informado');

        return Inertia::render('Backup/Show', [
            'backup' => $backup,
            'can' => [
                'download' => $request->user()->can('backup.download'),
                'destroy' => $request->user()->can('backup.destroy'),
            ],
        ]);
    }

    public function download(Backup $backup, DownloadBackupQuery $query): RedirectResponse|StreamedResponse
    {
        $response = $query->execute($backup);

        if ($response === null) {
            return redirect()->back()->with('error', 'O arquivo físico não existe no servidor.');
        }

        return $response;
    }

    /**
     * @throws BackupOperationFailed
     */
    public function upload(Request $request, StoreUploadedBackupAction $action): RedirectResponse
    {
        $data = UploadBackupData::validateAndCreate($request->all());

        if (! $data->backupFile->isValid()) {
            return redirect()->back()->with('error', 'Erro no upload do PHP: '.$data->backupFile->getErrorMessage());
        }

        $action->execute($data);

        return redirect()->back()->with('success', 'Backup importado com sucesso!');
    }

    /**
     * @throws Throwable
     */
    public function destroy(Backup $backup, DeleteBackupAction $action): RedirectResponse
    {
        $action->execute($backup);

        return redirect()
            ->route('backup.backups.index')
            ->with('success', 'Registro e arquivo removidos permanentemente.');
    }

    /**
     * @throws InvalidBackup
     * @throws BackupOperationFailed
     * @throws InvalidBackupRestoreConfirmation
     */
    public function restore(
        Backup $backup,
        RestoreBackupAction $action,
        BackupRestoreConfirmationPolicy $confirmationPolicy,
        Request $request,
    ): RedirectResponse {
        $validated = $request->validate([
            'password' => ['required', 'string'],
        ], [
            'password.required' => 'Informe sua senha para confirmar a restauração.',
        ]);

        $confirmationPolicy->ensurePasswordMatches(
            user: $request->user(),
            password: $validated['password'],
        );

        $action->execute($backup);

        return redirect()
            ->route('backup.backups.index')
            ->with('success', 'Sistema restaurado com sucesso para a versão selecionada!');
    }
}
