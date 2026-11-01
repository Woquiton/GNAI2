import { TableListRowActions, type TableListColumn } from '@/components/Tables/TableList/TableList';
import { teacherPortalUrls } from '../TeacherPortal.routes';
import type { TeacherPortalAssignment } from '../TeacherPortal.types';

/** Colunas dos alunos com adaptação vinculada ao professor. */
export const teacherAssignmentColumns: TableListColumn<TeacherPortalAssignment>[] = [
    {
        id: 'student',
        label: 'Aluno',
        width: '34%',
        minWidth: 140,
        fixed: 'start',
        render: (item) => item.student_name,
    },
    {
        id: 'discipline',
        label: 'Disciplina',
        width: '26%',
        minWidth: 110,
        render: (item) => item.discipline_name ?? 'Não informada',
    },
    {
        id: 'course',
        label: 'Curso',
        width: '24%',
        minWidth: 110,
        render: (item) => item.course_name ?? 'Não informado',
    },
    {
        id: 'actions',
        label: 'Ações',
        width: '16%',
        minWidth: 104,
        fixed: 'end',
        render: (item) => (
            <TableListRowActions
                view={{
                    href: teacherPortalUrls.student(item.student_id),
                    label: `Ver aluno ${item.student_name}`,
                }}
                edit={{
                    href: teacherPortalUrls.editDiscipline(item.id),
                    label: `Editar adaptação de ${item.discipline_name ?? 'disciplina'} de ${item.student_name}`,
                }}
            />
        ),
    },
];
