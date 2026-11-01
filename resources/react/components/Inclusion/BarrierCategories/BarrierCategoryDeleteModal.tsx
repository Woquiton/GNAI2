import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface BarrierCategoryDeleteModalProps {
    category: { name: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function BarrierCategoryDeleteModal({
    category,
    processing,
    onClose,
    onConfirm,
}: BarrierCategoryDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={category !== null}
            title="Excluir Categoria de Barreira"
            message={
                <>
                    A categoria <strong>{category?.name}</strong> será excluída permanentemente.
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo categoria..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
