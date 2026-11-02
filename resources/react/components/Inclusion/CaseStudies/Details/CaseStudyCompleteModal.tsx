import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface CaseStudyCompleteModalProps {
    open: boolean;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação da conclusão, que libera o PAEE e bloqueia novas edições. */
export default function CaseStudyCompleteModal({
    open,
    processing,
    onClose,
    onConfirm,
}: CaseStudyCompleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={open}
            title="Concluir Estudo de Caso"
            message="Concluir este Estudo de Caso? Essa ação libera a criação do PAEE e impede novas edições."
            processing={processing}
            confirmLabel="Confirmar conclusão"
            processingLabel="Concluindo Estudo de Caso..."
            confirmTone="success"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
