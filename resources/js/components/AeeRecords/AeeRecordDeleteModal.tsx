import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

/** `record` exclui o registro completo; `evaluation`, só a avaliação de um aluno. */
export type AeeRecordDeleteScope = 'record' | 'evaluation';

interface AeeRecordDeleteModalProps {
    scope: AeeRecordDeleteScope;
    open: boolean;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

interface AeeRecordDeleteTexts {
    title: string;
    message: string;
    processing: string;
}

const texts: Record<AeeRecordDeleteScope, AeeRecordDeleteTexts> = {
    record: {
        title: 'Excluir Registro de Atendimento',
        message: 'Deseja excluir permanentemente este registro de atendimento?',
        processing: 'Excluindo registro...',
    },
    evaluation: {
        title: 'Excluir Registro do Aluno',
        message: 'Excluir apenas o registro deste aluno neste atendimento AEE?',
        processing: 'Excluindo registro do aluno...',
    },
};

/** Confirmação de exclusão compartilhada pelas listagens e visualizações dos registros AEE. */
export default function AeeRecordDeleteModal({
    scope,
    open,
    processing,
    onClose,
    onConfirm,
}: AeeRecordDeleteModalProps): React.JSX.Element {
    const { title, message, processing: processingLabel } = texts[scope];

    return (
        <ConfirmActionModal
            open={open}
            title={title}
            message={message}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel={processingLabel}
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
