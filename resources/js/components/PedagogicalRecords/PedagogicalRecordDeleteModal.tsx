import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import { dateLabel } from '@/utils/formatters';
import type { PedagogicalRecordListRow } from './PedagogicalRecords.types';

interface PedagogicalRecordDeleteModalProps {
    open: boolean;
    /** Linha do histórico do aluno: identifica a data e o profissional do atendimento. */
    record?: Pick<PedagogicalRecordListRow, 'session_date' | 'professional_name'> | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pelo histórico do aluno e pela visualização. */
export default function PedagogicalRecordDeleteModal({
    open,
    record,
    processing,
    onClose,
    onConfirm,
}: PedagogicalRecordDeleteModalProps): React.JSX.Element {
    const professional = record?.professional_name ? ` com ${record.professional_name}` : '';
    const details = record ? (
        <>
            Atendimento de <strong>{dateLabel(record.session_date)}</strong>
            {professional}.
        </>
    ) : undefined;

    return (
        <ConfirmActionModal
            open={open}
            title="Excluir Atendimento Pedagógico"
            message="Deseja excluir este atendimento pedagógico?"
            details={details}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo atendimento..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
