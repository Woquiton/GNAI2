import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface DeficiencyDeleteModalProps {
    deficiency: { name: string } | null;
    /** Na visualização, a mensagem alerta sobre os alunos vinculados ao perfil. */
    context: 'list' | 'details';
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function DeficiencyDeleteModal({
    deficiency,
    context,
    processing,
    onClose,
    onConfirm,
}: DeficiencyDeleteModalProps): React.JSX.Element {
    const name = <strong>{deficiency?.name}</strong>;
    const message =
        context === 'details' ? (
            <>Excluir o perfil {name} pode afetar alunos vinculados a este registro.</>
        ) : (
            <>Deseja excluir o perfil {name}?</>
        );

    return (
        <ConfirmActionModal
            open={deficiency !== null}
            title="Excluir Perfil de Atendimento"
            message={message}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo perfil..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
