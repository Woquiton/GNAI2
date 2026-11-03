import type { TeacherDisciplinesProps } from '@/components/Inclusion/Teachers/Teachers.types';
import TeacherDisciplinesForm from '@/components/Inclusion/Teachers/Form/TeacherDisciplinesForm';
import { teacherBreadcrumb } from '@/components/Inclusion/Teachers/Teachers.routes';
import { teacherDisciplinesTour } from '@/components/Inclusion/Teachers/teacherTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionTeachersDisciplinesPage({
    teacher,
    ...props
}: TeacherDisciplinesProps): React.JSX.Element {
    return (
        <BusinessPage
            title={`Matriz curricular: ${teacher.person.name}`}
            subtitle="Selecione as disciplinas por curso em cada semestre letivo."
            breadcrumbItems={teacherBreadcrumb({
                teacher: { id: teacher.id, name: teacher.person.name },
                current: 'Matriz curricular',
            })}
            tour={teacherDisciplinesTour}
        >
            {/* O formulário reinicia ao trocar de professor ou de semestre. */}
            <TeacherDisciplinesForm
                key={`${teacher.id}-${props.semester?.id ?? 'none'}`}
                teacher={teacher}
                {...props}
            />
        </BusinessPage>
    );
}
