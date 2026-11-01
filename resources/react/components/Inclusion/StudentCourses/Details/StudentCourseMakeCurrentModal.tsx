import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface StudentCourseMakeCurrentModalProps {
    open: boolean;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação para tornar uma matrícula do histórico o curso atual do aluno. */
export default function StudentCourseMakeCurrentModal({
    open,
    processing,
    onClose,
    onConfirm,
}: StudentCourseMakeCurrentModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={open}
            title="Tornar Curso Atual"
            message="Deseja tornar este o curso atual do aluno? O curso atual será movido para o histórico."
            processing={processing}
            confirmLabel="Tornar atual"
            processingLabel="Atualizando matrícula..."
            confirmTone="success"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
