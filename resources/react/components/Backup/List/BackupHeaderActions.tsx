import { useRef } from 'react';
import Button from '@/components/UI/Button/Button';
import type { BackupListPermissions } from '../Backup.types';
import type { BackupListActions } from './useBackupListActions';
import './BackupList.css';

interface BackupHeaderActionsProps {
    actions: BackupListActions;
    permissions: Pick<BackupListPermissions, 'store' | 'upload'>;
    /** Erro de validação do arquivo importado (`backup_file`). */
    fileError?: string;
}

/** Importação de um ZIP e geração de um novo backup, à direita do título. */
export default function BackupHeaderActions({
    actions,
    permissions,
    fileError,
}: BackupHeaderActionsProps): React.JSX.Element {
    const fileInput = useRef<HTMLInputElement>(null);
    const { busy, actionBusy } = actions;
    const processingLabel = busy ? 'Processando...' : undefined;

    function clearFileInput(): void {
        if (fileInput.current) {
            fileInput.current.value = '';
        }
    }

    return (
        <div className="backupList__headerActions">
            {permissions.upload ? (
                <>
                    <input
                        ref={fileInput}
                        className="backupList__fileInput"
                        type="file"
                        accept=".zip,application/zip"
                        aria-label="Selecionar arquivo ZIP para importar backup"
                        disabled={actionBusy}
                        onChange={(event) => {
                            const file = event.currentTarget.files?.[0];

                            if (file) {
                                actions.upload(file, clearFileInput);
                            }
                        }}
                    />
                    <Button
                        tone="dark-blue"
                        labelIconClass="fa fa-cloud-upload"
                        label={processingLabel ?? 'Importar Backup'}
                        aria-label={busy ? 'Importando backup...' : 'Importar backup ZIP'}
                        aria-describedby={fileError ? 'backup-file-error' : undefined}
                        disabled={actionBusy}
                        onClick={() => fileInput.current?.click()}
                    />
                </>
            ) : null}
            {permissions.store ? (
                <Button
                    tone="list-action"
                    labelIconClass="fa fa-database"
                    label={processingLabel ?? 'Gerar Novo'}
                    aria-label={busy ? 'Gerando backup...' : 'Gerar novo backup'}
                    disabled={actionBusy}
                    onClick={actions.generate}
                />
            ) : null}
            {permissions.upload && fileError ? (
                <span id="backup-file-error" className="backupList__fileError" role="alert">
                    {fileError}
                </span>
            ) : null}
        </div>
    );
}
