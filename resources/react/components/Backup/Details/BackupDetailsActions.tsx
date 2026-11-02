import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { backupUrls } from '../Backup.routes';
import type { BackupShowProps } from '../Backup.types';

interface BackupDetailsActionsProps {
    backupId: number;
    permissions: BackupShowProps['can'];
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: baixar à esquerda; voltar e excluir ao centro. */
export default function BackupDetailsActions({
    backupId,
    permissions,
    deleting,
    onDelete,
}: BackupDetailsActionsProps): React.JSX.Element {
    const downloadAction = permissions.download ? (
        <Button
            href={backupUrls.download(backupId)}
            download
            tone="success"
            leftIconClass="fa fa-download"
            label="Baixar Backup"
            aria-label="Baixar backup"
            disabled={deleting}
        />
    ) : undefined;

    return (
        <FormActions secondary={downloadAction}>
            <Button
                href={backupUrls.index}
                tone="cancel"
                label="Voltar"
                aria-label="Voltar para backups"
                disabled={deleting}
            />
            {permissions.destroy ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    aria-label="Excluir backup"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}
