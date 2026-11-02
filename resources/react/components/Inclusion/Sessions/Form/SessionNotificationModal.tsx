import Button from '@/components/UI/Button/Button';
import Modal from '@/components/UI/Modal/Modal';
import './SessionNotificationModal.css';

interface SessionNotificationModalProps {
    open: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onChoose: (sendNotification: boolean) => void;
}

/** Pergunta, antes de salvar, se os participantes devem receber e-mail sobre o agendamento. */
export default function SessionNotificationModal({
    open,
    title,
    message,
    onClose,
    onChoose,
}: SessionNotificationModalProps): React.JSX.Element {
    return (
        <Modal
            open={open}
            title={title}
            effect="fadein"
            initialFocus=".sessionNotificationModal__back"
            onClose={onClose}
            contentClassName="sessionNotificationModal"
            footer={
                <div className="sessionNotificationModal__actions">
                    <Button
                        className="sessionNotificationModal__back"
                        tone="cancel"
                        label="Voltar"
                        title="Voltar ao formulário"
                        aria-label="Voltar ao formulário"
                        onClick={onClose}
                    />
                    <Button
                        tone="inverse"
                        leftIconClass="fa fa-save"
                        label="Salvar sem E-mail"
                        onClick={() => onChoose(false)}
                    />
                    <Button
                        tone="save"
                        leftIconClass="fa fa-envelope"
                        label="Salvar e Enviar E-mail"
                        onClick={() => onChoose(true)}
                    />
                </div>
            }
        >
            <p className="sessionNotificationModal__message">{message}</p>
        </Modal>
    );
}
