import { TableListRowActions, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import { sessionUrls } from '../Sessions.routes';
import type { SessionListRow } from '../Sessions.types';

export interface SessionColumnOptions {
    showStudents: boolean;
    showProfessional: boolean;
    showTime: boolean;
    canView: boolean;
    processing: boolean;
    onDelete: (session: SessionListRow) => void;
}

function sessionDescription(session: SessionListRow): string {
    return `agendamento de ${dateLabel(session.session_date)}`;
}

function SessionDateCell({
    session,
    showTime,
}: {
    session: SessionListRow;
    showTime: boolean;
}): React.JSX.Element {
    return (
        <span className="sessionList__date">
            {dateLabel(session.session_date)}
            {showTime && session.start_time ? <small>{session.start_time}</small> : null}
        </span>
    );
}

function studentNames(session: SessionListRow): React.ReactNode {
    if (session.student_names.length) {
        return session.student_names.join(', ');
    }

    return <span className="sessionList__muted">Sem alunos</span>;
}

/** Colunas da listagem; aluno e profissional dependem da tela que reutiliza a tabela. */
export function sessionColumns({
    showStudents,
    showProfessional,
    showTime,
    canView,
    processing,
    onDelete,
}: SessionColumnOptions): TableListColumn<SessionListRow>[] {
    const studentColumn: TableListColumn<SessionListRow> = {
        id: 'students',
        label: 'Aluno',
        width: showProfessional ? '24%' : '36%',
        render: studentNames,
    };
    const professionalColumn: TableListColumn<SessionListRow> = {
        id: 'professional',
        label: 'Profissional',
        width: showStudents ? '22%' : '36%',
        render: (session) => session.professional_name,
    };

    return [
        {
            id: 'date',
            label: 'Data',
            width: '16%',
            fixed: 'start',
            render: (session) => <SessionDateCell session={session} showTime={showTime} />,
        },
        ...(showStudents ? [studentColumn] : []),
        ...(showProfessional ? [professionalColumn] : []),
        {
            id: 'type',
            label: 'Tipo',
            width: '12%',
            render: (session) => session.type_label,
        },
        {
            id: 'status',
            label: 'Status',
            width: '12%',
            render: (session) => (
                <TableLabel tone={session.status_color}>{session.status_label}</TableLabel>
            ),
        },
        {
            id: 'actions',
            label: 'Ações',
            width: '14%',
            fixed: 'end',
            render: (session) => (
                <TableListRowActions
                    view={
                        canView && {
                            href: sessionUrls.show(session.id),
                            label: `Visualizar ${sessionDescription(session)}`,
                        }
                    }
                    remove={
                        session.can_delete && {
                            label: `Excluir ${sessionDescription(session)}`,
                            disabled: processing,
                            onClick: () => onDelete(session),
                        }
                    }
                    emptyLabel="Sem ações"
                />
            ),
        },
    ];
}
