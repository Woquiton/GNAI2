import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface WaitlistDeleteModalProps {
    waitlist: { id: number } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function WaitlistDeleteModal({
    waitlist,
    processing,
    onClose,
    onConfirm,
}: WaitlistDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={waitlist !== null}
            title="Excluir Solicitação"
            message={
                <>
                    Excluir permanentemente a solicitação <strong>#{waitlist?.id}</strong>?
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo solicitação..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
