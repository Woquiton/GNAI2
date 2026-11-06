import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { courseUrls } from '../Courses.routes';
import type { CourseListPermissions, CoursePaginator, CourseSummary } from '../Courses.types';
import { courseColumns } from './courseColumns';

interface CourseListProps {
    courses: CoursePaginator;
    permissions: CourseListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (course: CourseSummary) => void;
    onPageSelect: (page: number) => void;
}

export default function CourseList({
    courses,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: CourseListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<CourseSummary>[]>(
        () => [
            ...courseColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '15%',
                fixed: 'end',
                render: (course) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.view && {
                                href: courseUrls.show(course.id),
                                label: `Visualizar ${course.name}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir ${course.name}`,
                                disabled: processing,
                                onClick: () => onDelete(course),
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
            <TableListScroll aria-label="Tabela de cursos">
                <TableListTable
                    className="courseList"
                    columns={columns}
                    rows={courses.data}
                    rowKey={(course) => course.id}
                    page={courses}
                    emptyMessage="Nenhum curso encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={courses}
                disabled={loading}
                paginationLabel="Paginação de cursos"
                onSelect={onPageSelect}
            />
        </>
    );
}
