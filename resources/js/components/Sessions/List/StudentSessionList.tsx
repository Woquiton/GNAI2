import { TableListCard, useTableListVisit } from '@/components/Tables/TableList/TableList';
import { pickSessionStudentFilters, studentSessionsFailureText } from '../Sessions.constants';
import { sessionUrls } from '../Sessions.routes';
import type { SessionStudentIndexProps } from '../Sessions.types';
import SessionList from './SessionList';
import SessionStudentFilters from './SessionStudentFilters';

type StudentSessionListProps = Omit<SessionStudentIndexProps, 'can'> & { canView: boolean };

/** Histórico de agendamentos do aluno com filtros e paginação. */
export default function StudentSessionList({
    sessions,
    student,
    filters,
    options,
    canView,
}: StudentSessionListProps): React.JSX.Element {
    const list = useTableListVisit({
        url: sessionUrls.student(student.id),
        failureText: studentSessionsFailureText,
    });
    const currentFilters = pickSessionStudentFilters(filters);

    return (
        <TableListCard
            aria-label={`Listagem de agendamentos de ${student.name}`}
            loading={list.loading}
            loadingLabel="Atualizando agendamentos do aluno"
        >
            <SessionStudentFilters
                filters={filters}
                options={options}
                onSearch={(values) => list.visit(values)}
            />
            <SessionList
                sessions={sessions}
                canView={canView}
                showProfessional
                showTime
                loading={list.loading}
                emptyMessage="Nenhum agendamento encontrado para este aluno."
                onPage={(page) => list.visit(currentFilters, page)}
            />
        </TableListCard>
    );
}
