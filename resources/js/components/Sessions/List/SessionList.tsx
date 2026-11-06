import {
    TableListFooter,
    TableListScroll,
    TableListTable,
} from '@/components/Tables/TableList/TableList';
import SessionDeleteModal from '../SessionDeleteModal';
import type { SessionListPaginator, SessionListRow } from '../Sessions.types';
import { useSessionRemoval } from '../useSessionRemoval';
import { sessionColumns } from './sessionColumns';
import '@styles/components/Sessions/List/SessionList.css';

interface SessionListProps {
    sessions: SessionListPaginator;
    canView: boolean;
    showStudents?: boolean;
    showProfessional?: boolean;
    showTime?: boolean;
    loading?: boolean;
    emptyMessage?: string;
    onPage: (page: number) => void;
}

/** Tabela paginada de agendamentos com visualização e exclusão confirmada. */
export default function SessionList({
    sessions,
    canView,
    showStudents = false,
    showProfessional = false,
    showTime = false,
    loading = false,
    emptyMessage = 'Nenhum agendamento encontrado.',
    onPage,
}: SessionListProps): React.JSX.Element {
    const removal = useSessionRemoval<SessionListRow>();
    const columns = sessionColumns({
        showStudents,
        showProfessional,
        showTime,
        canView,
        processing: removal.processing,
        onDelete: removal.open,
    });

    return (
        <>
            <TableListScroll aria-label="Tabela de agendamentos">
                <TableListTable
                    columns={columns}
                    rows={sessions.data}
                    rowKey={(session) => session.id}
                    page={sessions}
                    emptyMessage={emptyMessage}
                />
            </TableListScroll>
            <TableListFooter
                page={sessions}
                disabled={loading}
                paginationLabel="Paginação de agendamentos"
                onSelect={onPage}
            />
            <SessionDeleteModal
                session={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={removal.confirm}
            />
        </>
    );
}
