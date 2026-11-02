import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface LoanDeleteModalProps {
    loan: { loanable: { name: string } } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function LoanDeleteModal({
    loan,
    processing,
    onClose,
    onConfirm,
}: LoanDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={loan !== null}
            title="Excluir Empréstimo"
            message={
                <>
                    Excluir permanentemente o empréstimo de <strong>{loan?.loanable.name}</strong>?
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo empréstimo..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
