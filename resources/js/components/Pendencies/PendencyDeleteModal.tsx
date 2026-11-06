import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface PendencyDeleteModalProps {
    pendency: { title: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function PendencyDeleteModal({
    pendency,
    processing,
    onClose,
    onConfirm,
}: PendencyDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={pendency !== null}
            title="Excluir Pendência"
            message={
                <>
                    Deseja excluir a pendência <strong>{pendency?.title}</strong>?
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo pendência..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
