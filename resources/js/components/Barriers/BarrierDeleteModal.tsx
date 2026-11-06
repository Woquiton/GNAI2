import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface BarrierDeleteModalProps {
    barrier: { name: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function BarrierDeleteModal({
    barrier,
    processing,
    onClose,
    onConfirm,
}: BarrierDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={barrier !== null}
            title="Excluir Barreira"
            message={
                <>
                    O registro <strong>{barrier?.name}</strong> será excluído permanentemente.
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo barreira..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
