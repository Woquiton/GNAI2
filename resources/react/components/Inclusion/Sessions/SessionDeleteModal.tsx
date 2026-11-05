import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import type { SessionRemovalTarget } from './Sessions.types';

interface SessionDeleteModalProps {
    session: SessionRemovalTarget | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem, pelo modal do dia e pela visualização. */
export default function SessionDeleteModal({
    session,
    processing,
    onClose,
    onConfirm,
}: SessionDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={session !== null}
            title="Excluir Agendamento"
            message="Mover este agendamento para a lixeira?"
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo agendamento..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
