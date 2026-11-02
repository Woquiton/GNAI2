import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface PaeeDeleteModalProps {
    /** Nome do PAEE escolhido ("PAEE v2 de Maria"); `null` mantém o modal fechado. */
    name: string | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pelas listagens e pela visualização. */
export default function PaeeDeleteModal({
    name,
    processing,
    onClose,
    onConfirm,
}: PaeeDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={name !== null}
            title="Excluir PAEE"
            message="Deseja remover este PAEE? Objetivos, recursos e revisões também serão excluídos."
            details={name ? <strong>{name}</strong> : undefined}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo PAEE..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
