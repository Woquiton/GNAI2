import TeacherForm from '@/components/Teachers/Form/TeacherForm';
import { teacherBreadcrumb } from '@/components/Teachers/Teachers.routes';
import type { TeacherEditProps } from '@/components/Teachers/Teachers.types';
import { teacherEditTour } from '@/components/Teachers/teacherTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function TeachersEditPage({
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
            tour={teacherEditTour}
        >
            <TeacherForm key={teacher.id} mode="edit" teacher={teacher} />
        </BusinessPage>
    );
}
