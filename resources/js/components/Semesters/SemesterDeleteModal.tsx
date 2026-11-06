import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import { semesterLabel } from './Semesters.constants';
import type { SemesterRecord } from './Semesters.types';

interface SemesterDeleteModalProps {
    semester: Pick<SemesterRecord, 'label' | 'year' | 'term'> | null;
    /** Na visualização, a mensagem alerta sobre frequências e sessões vinculadas. */
    warnLinkedRecords?: boolean;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem e pela visualização. */
export default function SemesterDeleteModal({
    semester,
    warnLinkedRecords = false,
    processing,
    onClose,
    onConfirm,
}: SemesterDeleteModalProps): React.JSX.Element {
    const name = <strong>{semester ? semesterLabel(semester) : ''}</strong>;
    const message = warnLinkedRecords ? (
        <>
            Excluir o semestre {name} pode afetar os registros de frequência e sessões vinculados a
            este período.
        </>
    ) : (
        <>Tem certeza que deseja excluir o semestre {name}?</>
    );

    return (
        <ConfirmActionModal
            open={semester !== null}
            title="Excluir Semestre"
            message={message}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo semestre..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
