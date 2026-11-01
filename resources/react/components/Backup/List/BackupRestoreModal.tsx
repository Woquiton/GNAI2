import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import type { BackupListActions } from './useBackupListActions';
import './BackupList.css';

/** Confirmação da restauração, que exige a senha do usuário por sobrescrever o ambiente atual. */
export default function BackupRestoreModal({
    actions,
}: {
    actions: BackupListActions;
}): React.JSX.Element {
    const { restoreTarget, restoreForm } = actions;
    const details = (
        <div className="backupList__restoreDetails">
            <TextInputField
                id="backup-restore-password"
                name="password"
                type="password"
                label="Confirme sua senha"
                required
                autoComplete="current-password"
                value={restoreForm.data.password}
                error={restoreForm.errors.password}
                onChange={(value) => {
                    restoreForm.clearErrors('password');
                    restoreForm.setData('password', value);
                }}
            />
            <small>
                Esta confirmação é obrigatória porque a restauração sobrescreve dados do sistema.
            </small>
        </div>
    );

    return (
        <ConfirmActionModal
            open={restoreTarget !== null}
            title="Restaurar Backup"
            message={
                <>
                    O backup <strong>{restoreTarget?.file_name}</strong> será usado para restaurar o
                    banco de dados e os arquivos de mídia, sobrescrevendo o ambiente atual.
                </>
            }
            details={details}
            processing={restoreForm.processing}
            confirmLabel="Confirmar restauração"
            processingLabel="Restaurando backup..."
            confirmTone="warning"
            onClose={actions.cancelRestore}
            onConfirm={actions.restore}
        />
    );
}
