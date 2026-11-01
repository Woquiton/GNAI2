import TeacherForm from '@/components/Inclusion/Teachers/Form/TeacherForm';
import { teacherBreadcrumb } from '@/components/Inclusion/Teachers/Teachers.routes';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionTeachersCreatePage(): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Professor"
            subtitle="Cadastre os dados pessoais, matrícula e atribua as disciplinas do novo docente."
            breadcrumbItems={teacherBreadcrumb({ current: 'Cadastrar' })}
        >
            <TeacherForm mode="create" />
        </BusinessPage>
    );
}
