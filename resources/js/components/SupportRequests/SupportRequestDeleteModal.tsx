import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

export default function SupportRequestDeleteModal({
    target,
    processing,
    onClose,
    onConfirm,
}: {
    target: { id: number } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={target !== null}
            title="Excluir solicitação de atendimento"
            message={
                <>
                    Deseja excluir a solicitação <strong>#{target?.id}</strong> e seus anexos?
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo solicitação…"
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
