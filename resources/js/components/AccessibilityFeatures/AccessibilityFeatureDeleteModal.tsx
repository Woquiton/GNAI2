import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface AccessibilityFeatureDeleteModalProps {
    feature: { name: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function AccessibilityFeatureDeleteModal({
    feature,
    processing,
    onClose,
    onConfirm,
}: AccessibilityFeatureDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={feature !== null}
            title="Excluir Recurso de Acessibilidade"
            message={
                <>
                    O recurso <strong>{feature?.name}</strong> será excluído permanentemente.
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo recurso..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
