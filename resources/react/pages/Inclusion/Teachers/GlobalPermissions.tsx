import { teacherBreadcrumb } from '@/components/Inclusion/Teachers/Teachers.routes';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import TeacherGlobalPermissionsForm from '@/components/Inclusion/Teachers/Form/TeacherGlobalPermissionsForm';
import type { TeacherGlobalPermissionsProps } from '@/components/Inclusion/Teachers/Teachers.types';

export default function InclusionTeachersGlobalPermissionsPage(
    props: TeacherGlobalPermissionsProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Permissões globais de professores"
            subtitle="As permissões selecionadas serão aplicadas a todos os usuários vinculados como professores."
            breadcrumbItems={teacherBreadcrumb({ current: 'Permissões globais' })}
        >
            <TeacherGlobalPermissionsForm {...props} />
        </BusinessPage>
    );
}
