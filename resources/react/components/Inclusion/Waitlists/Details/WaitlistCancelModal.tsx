import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface WaitlistCancelModalProps {
    waitlist: { id: number } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação do cancelamento de uma solicitação ainda ativa. */
export default function WaitlistCancelModal({
    waitlist,
    processing,
    onClose,
    onConfirm,
}: WaitlistCancelModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={waitlist !== null}
            title="Cancelar Solicitação"
            message={
                <>
                    A solicitação <strong>#{waitlist?.id}</strong> será cancelada e deixará de ficar
                    ativa.
                </>
            }
            processing={processing}
            confirmLabel="Confirmar cancelamento"
            processingLabel="Cancelando solicitação..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
