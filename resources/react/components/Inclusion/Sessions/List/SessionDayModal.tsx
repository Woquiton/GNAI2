import Button from '@/components/UI/Button/Button';
import Modal from '@/components/UI/Modal/Modal';
import { dateLabel } from '@/utils/formatters';
import SessionDeleteModal from '../SessionDeleteModal';
import type { SessionListRow } from '../Sessions.types';
import { useSessionRemoval } from '../useSessionRemoval';
import SessionDayCard from './SessionDayCard';
import './SessionDayModal.css';

interface SessionDayModalProps {
    date: string | null;
    sessions: SessionListRow[];
    canView: boolean;
    onClose: () => void;
}

function modalTitle(date: string | null, total: number): string | undefined {
    if (!date) {
        return undefined;
    }

    return `${dateLabel(date)} • ${total} ${total === 1 ? 'agendamento' : 'agendamentos'}`;
}

/** Agendamentos de um dia do calendário, com visualização e exclusão confirmada. */
export default function SessionDayModal({
    date,
    sessions,
    canView,
    onClose,
}: SessionDayModalProps): React.JSX.Element {
    const removal = useSessionRemoval<SessionListRow>();
    const content = sessions.length ? (
        <>
            <ol className="sessionDayModal__sessions">
                {sessions.map((session) => (
                    <SessionDayCard
                        key={session.id}
                        session={session}
                        canView={canView}
                        processing={removal.processing}
                        onDelete={removal.open}
                    />
                ))}
            </ol>
            <SessionDeleteModal
                session={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={removal.confirm}
            />
        </>
    ) : (
        <div className="sessionDayModal__empty">
            <i className="fa fa-calendar-o" aria-hidden="true" />
            <h5>Nenhum agendamento nesta data</h5>
            <p>Selecione outro dia ou ajuste os filtros para consultar a agenda.</p>
        </div>
    );

    return (
        <Modal
            open={date !== null}
            title={modalTitle(date, sessions.length)}
            size="large"
            effect="fadein"
            initialFocus=".modalLayer__close"
            onClose={onClose}
            contentClassName="sessionDayModal"
            bodyClassName="sessionDayModal__body"
            footer={
                <Button
                    tone="cancel"
                    label="Fechar"
                    title="Fechar agendamentos do dia"
                    onClick={onClose}
                />
            }
        >
            {content}
        </Modal>
    );
}
