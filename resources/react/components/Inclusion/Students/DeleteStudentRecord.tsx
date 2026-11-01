import type { ReactNode } from 'react';
import Button from '@/components/UI/Button/Button';
import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { STUDENT_FAILURE_TEXT } from './Students.constants';

interface DeleteStudentRecordProps {
    /** Rota de exclusão do registro vinculado ao aluno. */
    action: string;
    title: string;
    message: ReactNode;
    ariaLabel: string;
}

/**
 * Botão compacto de exclusão com confirmação para registros vinculados ao aluno (cursos, perfis,
 * responsáveis, documentos, PEIs e atendimentos) nas tabelas do prontuário e telas relacionadas.
 */
export default function DeleteStudentRecord({
    action,
    title,
    message,
    ariaLabel,
}: DeleteStudentRecordProps): React.JSX.Element {
    const removal = useConfirmedAction<string>({ failureText: STUDENT_FAILURE_TEXT });

    return (
        <>
            <Button
                type="button"
                tone="dark-red"
                size="sm"
                iconOnly
                leftIconClass="fa fa-trash-o"
                disabled={removal.processing}
                title={ariaLabel}
                aria-label={ariaLabel}
                onClick={() => removal.open(action)}
            />
            <ConfirmActionModal
                open={removal.target !== null}
                title={title}
                message={message}
                processing={removal.processing}
                confirmLabel="Confirmar exclusão"
                processingLabel="Excluindo registro..."
                confirmTone="dark-red"
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', action)}
            />
        </>
    );
}
