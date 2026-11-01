import TableActions from '@/components/Tables/TableActions/TableActions';
import Button from '@/components/UI/Button/Button';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { sessionUrls } from '../Sessions.routes';
import type { SessionListRow } from '../Sessions.types';

interface SessionDayCardProps {
    session: SessionListRow;
    canView: boolean;
    processing: boolean;
    onDelete: (session: SessionListRow) => void;
}

/** Resumo de um agendamento no modal do dia: horário, participantes, registro e ações. */
export default function SessionDayCard({
    session,
    canView,
    processing,
    onDelete,
}: SessionDayCardProps): React.JSX.Element {
    const startTime = session.start_time ?? '--:--';
    const endTime = session.end_time ?? '--:--';
    const recordState = session.has_record ? 'is-complete' : 'is-pending';
    const recordIcon = session.has_record ? 'fa fa-check-circle' : 'fa fa-clock-o';
    const hasActions = canView || session.can_delete;

    return (
        <li className="sessionDayModal__session">
            <header className="sessionDayModal__sessionHeader">
                <div>
                    <span className="sessionDayModal__time">
                        {startTime} a {endTime}
                    </span>
                    <span className="sessionDayModal__type">{session.type_label}</span>
                </div>
                <TableLabel tone={session.status_color}>{session.status_label}</TableLabel>
            </header>
            <dl className="sessionDayModal__details">
                <div>
                    <dt>Aluno(s)</dt>
                    <dd>{session.student_names.join(', ') || 'Sem alunos'}</dd>
                </div>
                <div>
                    <dt>Professor</dt>
                    <dd>{session.professional_name}</dd>
                </div>
                <div>
                    <dt>Registro</dt>
                    <dd className={recordState}>
                        <i className={recordIcon} aria-hidden="true" />
                        {session.record_label}
                    </dd>
                </div>
            </dl>
            {hasActions ? (
                <TableActions>
                    {canView ? (
                        <Button
                            href={sessionUrls.show(session.id)}
                            size="sm"
                            tone="dark-blue"
                            leftIconClass="fa fa-eye"
                            label="Visualizar"
                            title={`Visualizar agendamento das ${session.start_time ?? ''}`}
                        />
                    ) : null}
                    {session.can_delete ? (
                        <Button
                            type="button"
                            size="sm"
                            tone="dark-red"
                            leftIconClass="fa fa-trash-o"
                            label="Excluir"
                            title={`Excluir agendamento das ${session.start_time ?? ''}`}
                            disabled={processing}
                            onClick={() => onDelete(session)}
                        />
                    ) : null}
                </TableActions>
            ) : null}
        </li>
    );
}
