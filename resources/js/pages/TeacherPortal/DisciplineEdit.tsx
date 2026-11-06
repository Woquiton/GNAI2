import type { ReactNode } from 'react';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import TeacherPortalLayout from '@/components/Navigation/TeacherPortalLayout/TeacherPortalLayout';
import TeacherDisciplineForm from '@/components/TeacherPortal/Form/TeacherDisciplineForm';
import { teacherPortalBreadcrumb } from '@/components/TeacherPortal/TeacherPortal.routes';
import type { TeacherPortalDisciplineEditProps } from '@/components/TeacherPortal/TeacherPortal.types';
import { teacherPortalDisciplineTour } from '@/components/TeacherPortal/teacherPortalTours';

export default function TeacherPortalDisciplineEditPage({
    peiDiscipline,
}: TeacherPortalDisciplineEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title={peiDiscipline.discipline_name ?? 'Disciplina'}
            subtitle={`Aluno: ${peiDiscipline.student_name}`}
            breadcrumbItems={teacherPortalBreadcrumb({
                student: { id: peiDiscipline.student_id, name: peiDiscipline.student_name },
                current: 'Editar Adaptação',
            })}
            tour={teacherPortalDisciplineTour}
            className="teacherPortal"
        >
            <TeacherDisciplineForm peiDiscipline={peiDiscipline} />
        </BusinessPage>
    );
}

TeacherPortalDisciplineEditPage.layout = (page: ReactNode): ReactNode => (
    <TeacherPortalLayout>{page}</TeacherPortalLayout>
);
