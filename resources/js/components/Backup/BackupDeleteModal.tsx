import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface BackupDeleteModalProps {
    backup: { file_name: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function BackupDeleteModal({
    backup,
    processing,
    onClose,
    onConfirm,
}: BackupDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={backup !== null}
            title="Excluir Backup"
            message={
                <>
                    O arquivo <strong>{backup?.file_name}</strong> será apagado do servidor e o
                    registro removido do histórico.
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo backup..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
