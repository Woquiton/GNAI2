import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { studentUrls } from '../Students.routes';
import type { Student, StudentIndexProps } from '../Students.types';
import { studentColumns } from './studentColumns';

type StudentListProps = Pick<
    StudentIndexProps,
    'students' | 'permissions' | 'studentStatuses' | 'statusColors'
> & {
    loading: boolean;
    processing: boolean;
    onDelete: (student: Student) => void;
    onPageSelect: (page: number) => void;
};

export default function StudentList({
    students,
    permissions,
    studentStatuses,
    statusColors,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: StudentListProps): React.JSX.Element {
    const canView = permissions['student.view'];
    const canDelete = permissions['student.delete'];
    const columns = useMemo<TableListColumn<Student>[]>(
        () => [
            ...studentColumns({ studentStatuses, statusColors }),
            {
                id: 'actions',
                label: 'Ações',
                width: '15%',
                fixed: 'end',
                render: (student) => (
                    <TableListRowActions
                        view={
                            canView && {
                                href: studentUrls.show(student.id),
                                label: `Visualizar aluno ${student.person.name}`,
                            }
                        }
                        remove={
                            canDelete && {
                                label: `Excluir aluno ${student.person.name}`,
                                disabled: processing,
                                onClick: () => onDelete(student),
                            }
                        }
                    />
                ),
            },
        ],
        [studentStatuses, statusColors, canView, canDelete, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de alunos">
                <TableListTable
                    columns={columns}
                    rows={students.data}
                    rowKey={(student) => student.id}
                    page={students}
                    emptyMessage="Nenhum aluno encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={students}
                disabled={loading}
                paginationLabel="Páginas de alunos"
                onSelect={onPageSelect}
            />
        </>
    );
}
