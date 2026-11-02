import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface StudentDocumentDeleteModalProps {
    studentDocument: { title: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão permanente do documento do aluno. */
export default function StudentDocumentDeleteModal({
    studentDocument,
    processing,
    onClose,
    onConfirm,
}: StudentDocumentDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={studentDocument !== null}
            title="Excluir Documento"
            message={
                <>
                    Deseja excluir permanentemente o documento{' '}
                    <strong>{studentDocument?.title}</strong>?
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo documento..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
