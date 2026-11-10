import type { ReactNode } from 'react';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import TeacherPortalLayout from '@/components/Navigation/TeacherPortalLayout/TeacherPortalLayout';
import TeacherProfileForm from '@/components/TeacherPortal/Form/TeacherProfileForm';
import { teacherPortalBreadcrumb } from '@/components/TeacherPortal/TeacherPortal.routes';
import type { TeacherProfileProps } from '@/components/TeacherPortal/TeacherPortal.types';
import { teacherProfileTour } from '@/components/TeacherPortal/teacherPortalTours';

export default function TeacherProfilePage(props: TeacherProfileProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Meu Perfil"
            subtitle="Atualize seu nome e sua foto."
            breadcrumbItems={teacherPortalBreadcrumb({ current: 'Meu Perfil' })}
            tour={teacherProfileTour}
        >
            <TeacherProfileForm key={props.person.id} {...props} />
        </BusinessPage>
    );
}

TeacherProfilePage.layout = (page: ReactNode): ReactNode => (
    <TeacherPortalLayout>{page}</TeacherPortalLayout>
);
