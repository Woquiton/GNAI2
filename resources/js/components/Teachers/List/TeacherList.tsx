import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { teacherUrls } from '../Teachers.routes';
import type { TeacherListPermissions, TeacherPaginator, TeacherRecord } from '../Teachers.types';
import { teacherColumns } from './teacherColumns';

interface TeacherListProps {
    teachers: TeacherPaginator;
    permissions: TeacherListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (teacher: TeacherRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function TeacherList({
    teachers,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: TeacherListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<TeacherRecord>[]>(
        () => [
            ...teacherColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '14%',
                fixed: 'end',
                render: (teacher) => (
                    <TableListRowActions
                        view={
                            permissions.view && {
                                href: teacherUrls.show(teacher.id),
                                label: `Visualizar detalhes de ${teacher.person.name}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir professor ${teacher.person.name}`,
                                disabled: processing,
                                onClick: () => onDelete(teacher),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.view, permissions.delete, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de professores">
                <TableListTable
                    columns={columns}
                    rows={teachers.data}
                    rowKey={(teacher) => teacher.id}
                    page={teachers}
                    emptyMessage="Nenhum professor encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={teachers}
                disabled={loading}
                paginationLabel="Paginação de professores"
                onSelect={onPageSelect}
            />
        </>
    );
}
