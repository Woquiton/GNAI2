import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface ItemDeleteModalProps {
    item: { name: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function ItemDeleteModal({
    item,
    processing,
    onClose,
    onConfirm,
}: ItemDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={item !== null}
            title="Excluir Item"
            message={
                <>
                    Excluir o item <strong>{item?.name}</strong>?
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo item..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
