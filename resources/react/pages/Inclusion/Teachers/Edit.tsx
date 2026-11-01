import TeacherForm from '@/components/Inclusion/Teachers/Form/TeacherForm';
import { teacherBreadcrumb } from '@/components/Inclusion/Teachers/Teachers.routes';
import type { TeacherEditProps } from '@/components/Inclusion/Teachers/Teachers.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionTeachersEditPage({
    teacher,
}: TeacherEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Professor"
            subtitle="Atualize os dados e as disciplinas atribuídas ao docente."
            breadcrumbItems={teacherBreadcrumb({
                teacher: { id: teacher.id, name: teacher.person.name },
                current: 'Editar',
            })}
        >
            <TeacherForm key={teacher.id} mode="edit" teacher={teacher} />
        </BusinessPage>
    );
}
