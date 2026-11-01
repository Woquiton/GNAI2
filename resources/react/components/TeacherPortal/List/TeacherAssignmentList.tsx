import {
    TableListCard,
    TableListScroll,
    TableListSummary,
    TableListTable,
} from '@/components/Tables/TableList/TableList';
import type { TeacherPortalIndexProps } from '../TeacherPortal.types';
import { teacherAssignmentColumns } from './teacherAssignmentColumns';

const listLabel = 'Alunos e adaptações vinculados a você';

/** Todos os vínculos do professor em uma tabela com contagem estática, sem paginação. */
export default function TeacherAssignmentList({
    assignments,
}: TeacherPortalIndexProps): React.JSX.Element {
    const summary = `${assignments.length} ${assignments.length === 1 ? 'registro' : 'registros'}`;

    return (
        <TableListCard aria-label={listLabel}>
            <TableListScroll aria-label={listLabel}>
                <TableListTable
                    columns={teacherAssignmentColumns}
                    summary={summary}
                    rows={assignments}
                    rowKey={(item) => item.id}
                    emptyMessage="Nenhum aluno com adaptação vinculada a você no momento."
                />
            </TableListScroll>
            <TableListSummary>{summary}</TableListSummary>
        </TableListCard>
    );
}
