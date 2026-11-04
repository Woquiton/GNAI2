import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface TagDeleteModalProps {
    tag: { name: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function TagDeleteModal({
    tag,
    processing,
    onClose,
    onConfirm,
}: TagDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={tag !== null}
            title="Excluir Etiqueta"
            message={
                <>
                    A etiqueta <strong>{tag?.name}</strong> será excluída permanentemente.
                </>
            }
            processing={processing}
            details="A etiqueta será retirada das publicações e dos marcadores em que estiver aplicada. Os registros e os e-mails serão preservados. Para impedir novas aplicações sem remover os vínculos, desative a etiqueta."
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo etiqueta..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
