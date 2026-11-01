import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface TeacherDeleteModalProps {
    /** Professor escolhido; `null` mantém o modal fechado. */
    target: { name: string } | null;
    /** A listagem alerta sobre os dados vinculados; a visualização, sobre o acesso ao sistema. */
    context: 'list' | 'details';
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão de professor, compartilhada pela listagem e pela visualização. */
export default function TeacherDeleteModal({
    target,
    context,
    processing,
    onClose,
    onConfirm,
}: TeacherDeleteModalProps): React.JSX.Element {
    const message =
        context === 'list' ? (
            <>
                Deseja remover o professor <strong>{target?.name}</strong>? Todos os dados
                vinculados serão excluídos.
            </>
        ) : (
            <>
                Excluir permanentemente o professor <strong>{target?.name}</strong> e seu acesso ao
                sistema?
            </>
        );

    return (
        <ConfirmActionModal
            open={target !== null}
            title="Excluir Professor"
            message={message}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo professor..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
