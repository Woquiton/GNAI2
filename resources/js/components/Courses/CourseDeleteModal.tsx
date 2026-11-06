import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface CourseDeleteModalProps {
    course: { name: string } | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function CourseDeleteModal({
    course,
    processing,
    onClose,
    onConfirm,
}: CourseDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={course !== null}
            title="Excluir Curso"
            message={
                <>
                    Excluir o curso <strong>{course?.name}</strong>?
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo curso..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
