import {
    TableListFooter,
    TableListScroll,
    TableListTable,
} from '@/components/Tables/TableList/TableList';
import type { TeacherAssignmentPaginator } from '../TeacherPortal.types';
import { teacherAssignmentColumns } from './teacherAssignmentColumns';

const listLabel = 'Alunos e adaptações vinculados a você';

/** Vínculos do professor filtrados e paginados pelo servidor. */
export default function TeacherAssignmentList({
    assignments,
    loading,
    onPageSelect,
}: {
    assignments: TeacherAssignmentPaginator;
    loading: boolean;
    onPageSelect: (page: number) => void;
}): React.JSX.Element {
    return (
        <>
            <TableListScroll aria-label={listLabel}>
                <TableListTable
                    columns={teacherAssignmentColumns}
                    page={assignments}
                    rows={assignments.data}
                    rowKey={(item) => item.id}
                    emptyMessage="Nenhum aluno com adaptação vinculado a você encontrado para os filtros informados."
                />
            </TableListScroll>
            <TableListFooter
                page={assignments}
                disabled={loading}
                paginationLabel="Paginação dos meus alunos e adaptações"
                onSelect={onPageSelect}
            />
        </>
    );
}
