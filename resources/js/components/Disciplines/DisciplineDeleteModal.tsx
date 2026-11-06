import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface DisciplineDeleteModalProps {
    discipline: { name: string } | null;
    /** Na visualização, a pergunta pede a confirmação explícita ("Deseja realmente..."). */
    emphatic?: boolean;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function DisciplineDeleteModal({
    discipline,
    emphatic = false,
    processing,
    onClose,
    onConfirm,
}: DisciplineDeleteModalProps): React.JSX.Element {
    const question = emphatic ? 'Deseja realmente excluir' : 'Deseja excluir';

    return (
        <ConfirmActionModal
            open={discipline !== null}
            title="Excluir Disciplina"
            message={
                <>
                    {question} a disciplina <strong>{discipline?.name}</strong>?
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo disciplina..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
