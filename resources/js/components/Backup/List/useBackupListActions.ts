import { router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { notifyConnectionFailure, notifyOperationFailure } from '@/components/UI/NotificationToast/operationFeedback';
import { backupUrls } from '../Backup.routes';
import type { BackupRecord } from '../Backup.types';

/**
 * Operações da listagem de backups: importar ZIP, gerar, restaurar (com confirmação de senha) e
 * excluir. Uma operação por vez; o sucesso vem do `flash` do controller.
 *
 * `beforeOpen` permite à página cancelar a busca agendada dos filtros ao abrir uma confirmação.
 */
export function useBackupListActions({ beforeOpen }: { beforeOpen: () => void }) {
    const pending = useRef(false);
    const [uploading, setUploading] = useState(false);
    const [restoreTarget, setRestoreTarget] = useState<BackupRecord | null>(null);
    const restoreForm = useForm({ password: '' });
    const restoreSubmission = useFormSubmission(restoreForm);
    const removal = useConfirmedAction<BackupRecord>({
        failureText: 'Não foi possível excluir o backup. Tente novamente.',
    });
    const generation = useConfirmedAction<never>({
        failureText: 'Não foi possível gerar o backup. Tente novamente.',
    });
    const busy = uploading || generation.processing;
    const actionBusy = busy || removal.processing || restoreForm.processing;

    function resetRestoreForm(): void {
        restoreForm.reset();
        restoreForm.clearErrors();
    }

    function closeRestore(): void {
        setRestoreTarget(null);
        resetRestoreForm();
    }

    function upload(file: File, onFinish: () => void): void {
        if (pending.current || actionBusy) {
            return;
        }

        pending.current = true;
        setUploading(true);
        router.post(
            backupUrls.upload,
            { backup_file: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onNetworkError: () => {
                    notifyConnectionFailure();
                    return false;
                },
                onHttpException: () => {
                    notifyOperationFailure('Não foi possível importar o backup. Tente novamente.');
                    return false;
                },
                onFinish: () => {
                    pending.current = false;
                    setUploading(false);
                    onFinish();
                },
            },
        );
    }

    function generate(): void {
        if (pending.current || actionBusy) {
            return;
        }

        generation.submit('post', backupUrls.store);
    }

    function openRestore(backup: BackupRecord): void {
        beforeOpen();
        resetRestoreForm();
        setRestoreTarget(backup);
    }

    function openRemoval(backup: BackupRecord): void {
        beforeOpen();
        resetRestoreForm();
        removal.open(backup);
    }

    function restore(): void {
        if (!restoreTarget) {
            return;
        }

        restoreSubmission.submit({
            url: backupUrls.restore(restoreTarget.id),
            failureText: 'Não foi possível restaurar o backup. Tente novamente.',
            options: { onSuccess: closeRestore },
        });
    }

    function cancelRestore(): void {
        if (!restoreForm.processing) {
            closeRestore();
        }
    }

    function confirmRemoval(): void {
        if (removal.target) {
            removal.submit('delete', backupUrls.destroy(removal.target.id));
        }
    }

    return {
        busy,
        actionBusy,
        upload,
        generate,
        restoreTarget,
        restoreForm,
        openRestore,
        restore,
        cancelRestore,
        removal,
        openRemoval,
        confirmRemoval,
    };
}

export type BackupListActions = ReturnType<typeof useBackupListActions>;
