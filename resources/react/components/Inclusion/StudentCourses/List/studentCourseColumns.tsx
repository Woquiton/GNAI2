import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { UNKNOWN_COURSE } from '../StudentCourses.constants';
import type { StudentCourseListRecord } from '../StudentCourses.types';

export function courseName(enrollment: StudentCourseListRecord): string {
    return enrollment.course?.name ?? UNKNOWN_COURSE;
}

/** Colunas de dados da listagem; todas as linhas pertencem ao mesmo aluno. */
export function studentCourseColumns(
    studentName: string,
): TableListColumn<StudentCourseListRecord>[] {
    return [
        {
            id: 'student',
            label: 'Aluno',
            width: '22%',
            fixed: 'start',
            render: () => studentName,
        },
        { id: 'course', label: 'Curso / Série', width: '24%', render: courseName },
        {
            id: 'year',
            label: 'Ano letivo',
            width: '12%',
            render: (enrollment) => enrollment.academic_year,
        },
        {
            id: 'semester',
            label: 'Semestre',
            width: '12%',
            render: (enrollment) => enrollment.semester?.label ?? '—',
        },
        {
            id: 'status',
            label: 'Situação',
            width: '12%',
            render: (enrollment) => (
                <TableLabel tone={enrollment.is_current ? 'success' : 'inverse'}>
                    {enrollment.is_current ? 'Atual' : 'Histórico'}
                </TableLabel>
            ),
        },
    ];
}
