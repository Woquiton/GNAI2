import TeacherForm from '@/components/Teachers/Form/TeacherForm';
import { teacherBreadcrumb } from '@/components/Teachers/Teachers.routes';
import { teacherCreateTour } from '@/components/Teachers/teacherTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function TeachersCreatePage(): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Professor"
            subtitle="Cadastre os dados pessoais, matrícula e atribua as disciplinas do novo docente."
            breadcrumbItems={teacherBreadcrumb({ current: 'Cadastrar' })}
            tour={teacherCreateTour}
        >
            <TeacherForm mode="create" />
        </BusinessPage>
    );
}
