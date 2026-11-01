import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface StudentDeleteModalProps {
    student: { person: { name: string } } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão do aluno, compartilhada pela listagem e pelo prontuário. */
export default function StudentDeleteModal({
    student,
    processing,
    onClose,
    onConfirm,
}: StudentDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={student !== null}
            title="Excluir Aluno"
            message={
                <>
                    Excluir o aluno <strong>{student?.person.name}</strong>?
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo aluno..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
