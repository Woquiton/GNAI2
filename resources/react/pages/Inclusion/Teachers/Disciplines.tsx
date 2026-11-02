import type { TeacherDisciplinesProps } from '@/components/Inclusion/Teachers/Teachers.types';
import TeacherDisciplinesForm from '@/components/Inclusion/Teachers/Form/TeacherDisciplinesForm';
import { teacherBreadcrumb } from '@/components/Inclusion/Teachers/Teachers.routes';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionTeachersDisciplinesPage({
    teacher,
    ...props
}: TeacherDisciplinesProps): React.JSX.Element {
    return (
        <BusinessPage
            title={`Matriz curricular: ${teacher.person.name}`}
            subtitle="Selecione as disciplinas por curso. Os vínculos são organizados separadamente por curso."
            breadcrumbItems={teacherBreadcrumb({
                teacher: { id: teacher.id, name: teacher.person.name },
                current: 'Matriz curricular',
            })}
        >
            <TeacherDisciplinesForm key={teacher.id} teacher={teacher} {...props} />
        </BusinessPage>
    );
}
