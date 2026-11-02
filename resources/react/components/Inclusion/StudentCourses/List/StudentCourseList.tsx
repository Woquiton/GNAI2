import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { studentCourseUrls } from '../StudentCourses.routes';
import type {
    StudentCourseListPermissions,
    StudentCourseListRecord,
    StudentCoursePaginator,
} from '../StudentCourses.types';
import { courseName, studentCourseColumns } from './studentCourseColumns';

interface StudentCourseListProps {
    studentName: string;
    studentCourses: StudentCoursePaginator;
    permissions: StudentCourseListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (enrollment: StudentCourseListRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function StudentCourseList({
    studentName,
    studentCourses,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: StudentCourseListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<StudentCourseListRecord>[]>(
        () => [
            ...studentCourseColumns(studentName),
            {
                id: 'actions',
                label: 'Ações',
                width: '18%',
                fixed: 'end',
                render: (enrollment) => (
                    <TableListRowActions
                        view={
                            permissions.view && {
                                href: studentCourseUrls.show(enrollment.id),
                                label: `Visualizar curso ${courseName(enrollment)} de ${studentName}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir matrícula no curso ${courseName(enrollment)}`,
                                disabled: processing,
                                onClick: () => onDelete(enrollment),
                            }
                        }
                    />
                ),
            },
        ],
        [studentName, permissions.view, permissions.delete, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de matrículas do aluno">
                <TableListTable
                    columns={columns}
                    rows={studentCourses.data}
                    rowKey={(enrollment) => enrollment.id}
                    page={studentCourses}
                    emptyMessage="Nenhum curso do aluno encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={studentCourses}
                disabled={loading}
                paginationLabel="Paginação de matrículas"
                onSelect={onPageSelect}
            />
        </>
    );
}
