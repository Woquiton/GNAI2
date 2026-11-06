import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface PendencyCompleteModalProps {
    open: boolean;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação da conclusão de uma pendência. */
export default function PendencyCompleteModal({
    open,
    processing,
    onClose,
    onConfirm,
}: PendencyCompleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={open}
            title="Concluir Pendência"
            message="Marcar como concluída?"
            processing={processing}
            confirmLabel="Confirmar conclusão"
            processingLabel="Concluindo pendência..."
            confirmTone="success"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
