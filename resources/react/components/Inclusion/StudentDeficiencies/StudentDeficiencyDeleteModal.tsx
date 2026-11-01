import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface StudentDeficiencyDeleteModalProps {
    /** Perfil escolhido; `null` mantém o modal fechado. */
    target: { profileName: string } | null;
    /** A listagem pede a remoção; a visualização reforça que a exclusão é permanente. */
    context: 'list' | 'details';
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão do perfil de atendimento do aluno (listagem e visualização). */
export default function StudentDeficiencyDeleteModal({
    target,
    context,
    processing,
    onClose,
    onConfirm,
}: StudentDeficiencyDeleteModalProps): React.JSX.Element {
    const action = context === 'list' ? 'Deseja remover' : 'Deseja excluir permanentemente';

    return (
        <ConfirmActionModal
            open={target !== null}
            title="Excluir Perfil de Atendimento"
            message={
                <>
                    {action} o perfil <strong>{target?.profileName}</strong> do registro do aluno?
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo perfil..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
