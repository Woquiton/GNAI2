import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import type { SessionRemovalTarget } from './Sessions.types';

interface SessionDeleteModalProps {
    session: SessionRemovalTarget | null;
    processing: boolean;
    sendNotification: boolean;
    onSendNotificationChange: (checked: boolean) => void;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pela listagem, pelo modal do dia e pela visualização. */
export default function SessionDeleteModal({
    session,
    processing,
    sendNotification,
    onSendNotificationChange,
    onClose,
    onConfirm,
}: SessionDeleteModalProps): React.JSX.Element {
    const notificationChoice = session?.is_scheduled ? (
        <ChoiceControl
            type="checkbox"
            tone="purple"
            id="session-delete-send-notification"
            name="send_notification"
            label="Enviar e-mail de aviso aos participantes"
            checked={sendNotification}
            disabled={processing}
            onChange={onSendNotificationChange}
        />
    ) : undefined;

    return (
        <ConfirmActionModal
            open={session !== null}
            title="Excluir Agendamento"
            message="Mover este agendamento para a lixeira?"
            details={notificationChoice}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo agendamento..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
