import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface LocationDeleteModalProps {
    location: { name: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function LocationDeleteModal({
    location,
    processing,
    onClose,
    onConfirm,
}: LocationDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={location !== null}
            title="Excluir Ponto de Referência"
            message={
                <>
                    O ponto <strong>{location?.name}</strong> será excluído permanentemente.
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo ponto..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
