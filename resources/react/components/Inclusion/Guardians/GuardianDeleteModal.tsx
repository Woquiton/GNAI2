import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface GuardianDeleteModalProps {
    guardian: { person: { name: string } } | null;
    /** A listagem confirma a remoção do vínculo; a visualização, a do responsável. */
    context: 'list' | 'details';
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão do responsável, compartilhada pela listagem e pela visualização. */
export default function GuardianDeleteModal({
    guardian,
    context,
    processing,
    onClose,
    onConfirm,
}: GuardianDeleteModalProps): React.JSX.Element {
    const subject = context === 'list' ? 'o vínculo de responsabilidade de' : 'o responsável';

    return (
        <ConfirmActionModal
            open={guardian !== null}
            title="Excluir Responsável"
            message={
                <>
                    Deseja remover {subject} <strong>{guardian?.person.name}</strong>? Esta ação não
                    pode ser desfeita.
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo responsável..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
