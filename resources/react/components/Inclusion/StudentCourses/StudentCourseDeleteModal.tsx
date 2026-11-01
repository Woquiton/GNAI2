import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface StudentCourseDeleteModalProps {
    /** Curso da matrícula escolhida; `null` mantém o modal fechado. */
    target: { courseName: string } | null;
    /** A listagem cita o histórico do aluno; a visualização pergunta diretamente. */
    context: 'list' | 'details';
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão de matrícula, compartilhada pela listagem e pela visualização. */
export default function StudentCourseDeleteModal({
    target,
    context,
    processing,
    onClose,
    onConfirm,
}: StudentCourseDeleteModalProps): React.JSX.Element {
    const message =
        context === 'list' ? (
            <>
                Excluir a matrícula no curso <strong>{target?.courseName}</strong> do histórico do
                aluno?
            </>
        ) : (
            <>
                Deseja excluir a matrícula no curso <strong>{target?.courseName}</strong>?
            </>
        );

    return (
        <ConfirmActionModal
            open={target !== null}
            title="Excluir Matrícula"
            message={message}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo matrícula..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
