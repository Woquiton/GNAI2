import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface ProfessionalDeleteModalProps {
    /** Profissional escolhido; `null` mantém o modal fechado. */
    target: { name: string } | null;
    /** A listagem pergunta pela remoção; a visualização cita a exclusão do sistema. */
    context: 'list' | 'details';
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão de profissional, compartilhada pela listagem e pela visualização. */
export default function ProfessionalDeleteModal({
    target,
    context,
    processing,
    onClose,
    onConfirm,
}: ProfessionalDeleteModalProps): React.JSX.Element {
    const message =
        context === 'list' ? (
            <>
                Deseja remover o profissional <strong>{target?.name}</strong>?
            </>
        ) : (
            <>
                Excluir o profissional <strong>{target?.name}</strong> do sistema?
            </>
        );

    return (
        <ConfirmActionModal
            open={target !== null}
            title="Excluir Profissional"
            message={message}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo profissional..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
