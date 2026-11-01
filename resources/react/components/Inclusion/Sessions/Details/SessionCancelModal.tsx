import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import { TextAreaField } from '@/components/Forms/FormFields/FormFields';
import { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import type { SessionCancellation } from './useSessionCancellation';

interface SessionCancelModalProps {
    cancellation: SessionCancellation;
}

/** Confirmação do cancelamento com motivo obrigatório e aviso opcional por e-mail. */
export default function SessionCancelModal({
    cancellation,
}: SessionCancelModalProps): React.JSX.Element {
    const { form } = cancellation;
    const details = (
        <FormStack>
            <TextAreaField
                id="cancellation_reason"
                name="cancellation_reason"
                label="Motivo do Cancelamento"
                required
                rows={3}
                placeholder="Descreva o motivo obrigatório..."
                value={form.data.cancellation_reason}
                error={form.errors.cancellation_reason}
                disabled={form.processing}
                onChange={(value) => form.setData('cancellation_reason', value)}
            />
            <ChoiceControl
                type="checkbox"
                tone="purple"
                id="session-cancel-send-notification"
                name="send_notification"
                label="Enviar e-mail de aviso aos participantes"
                checked={form.data.send_notification}
                disabled={form.processing}
                onChange={(checked) => form.setData('send_notification', checked)}
            />
        </FormStack>
    );

    return (
        <ConfirmActionModal
            open={cancellation.isOpen}
            title="Confirmar Cancelamento"
            message="Tem certeza que deseja cancelar este agendamento?"
            details={details}
            processing={form.processing}
            confirmLabel="Confirmar cancelamento"
            processingLabel="Cancelando agendamento..."
            cancelLabel="Voltar"
            confirmTone="dark-red"
            onClose={cancellation.close}
            onConfirm={cancellation.confirm}
        />
    );
}
