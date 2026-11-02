import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { CourseSummary } from '../Courses.types';

/** Colunas da listagem; as complementares começam ocultas no seletor de colunas. */
export const courseColumns: TableListColumn<CourseSummary>[] = [
    {
        id: 'name',
        label: 'Nome do Curso',
        width: '45%',
        fixed: 'start',
        render: (course) => course.name,
    },
    {
        id: 'disciplines',
        label: 'Disciplinas',
        width: '22%',
        render: (course) => `${course.disciplines_count} matérias`,
    },
    {
        id: 'status',
        label: 'Status',
        width: '18%',
        render: (course) => (
            <TableLabel tone={course.is_active ? 'success' : 'inverse'}>
                {course.is_active ? 'Ativo' : 'Inativo'}
            </TableLabel>
        ),
    },
    {
        id: 'description',
        label: 'Descrição',
        width: '16%',
        defaultVisible: false,
        render: (course) => formatTableListText(course.description),
    },
    {
        id: 'enrollments',
        label: 'Vínculos de alunos',
        width: '16%',
        defaultVisible: false,
        render: (course) => course.student_courses_count,
    },
];
