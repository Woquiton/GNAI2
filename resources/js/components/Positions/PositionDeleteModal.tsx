import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface PositionDeleteModalProps {
    position: { name: string } | null;
    /** Na visualização, a mensagem alerta sobre os profissionais vinculados. */
    warnLinkedProfessionals?: boolean;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function PositionDeleteModal({
    position,
    warnLinkedProfessionals = false,
    processing,
    onClose,
    onConfirm,
}: PositionDeleteModalProps): React.JSX.Element {
    const name = <strong>{position?.name}</strong>;
    const message = warnLinkedProfessionals ? (
        <>Excluir o cargo {name} pode afetar profissionais vinculados.</>
    ) : (
        <>Deseja excluir o cargo {name}?</>
    );

    return (
        <ConfirmActionModal
            open={position !== null}
            title="Excluir Cargo"
            message={message}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo cargo..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
