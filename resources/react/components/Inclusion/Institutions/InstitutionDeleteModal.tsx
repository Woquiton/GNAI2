import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface InstitutionDeleteModalProps {
    institution: { name: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function InstitutionDeleteModal({
    institution,
    processing,
    onClose,
    onConfirm,
}: InstitutionDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={institution !== null}
            title="Excluir Instituição"
            message={
                <>
                    A instituição <strong>{institution?.name}</strong> e seus dados relacionados
                    serão excluídos permanentemente.
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo instituição..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
