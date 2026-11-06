import type { ReactNode } from 'react';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import TeacherPortalLayout from '@/components/Navigation/TeacherPortalLayout/TeacherPortalLayout';
import TeacherAssignmentList from '@/components/TeacherPortal/List/TeacherAssignmentList';
import { teacherPortalBreadcrumb } from '@/components/TeacherPortal/TeacherPortal.routes';
import type { TeacherPortalIndexProps } from '@/components/TeacherPortal/TeacherPortal.types';
import { teacherPortalIndexTour } from '@/components/TeacherPortal/teacherPortalTours';

export default function TeacherPortalIndexPage(props: TeacherPortalIndexProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Meus Alunos e Adaptações (PEI)"
            subtitle="Aqui estão os alunos com PEI vinculado a você. Você pode editar a sua adaptação e consultar o perfil completo do aluno (em modo leitura)."
            breadcrumbItems={teacherPortalBreadcrumb()}
            tour={teacherPortalIndexTour}
            className="teacherPortal"
        >
            <TeacherAssignmentList {...props} />
        </BusinessPage>
    );
}

TeacherPortalIndexPage.layout = (page: ReactNode): ReactNode => (
    <TeacherPortalLayout>{page}</TeacherPortalLayout>
);
