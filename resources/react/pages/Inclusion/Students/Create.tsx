import StudentForm from '@/components/Inclusion/Students/Form/StudentForm';
import { studentBreadcrumb } from '@/components/Inclusion/Students/Students.routes';
import type { StudentFormOptions } from '@/components/Inclusion/Students/Students.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function StudentsCreate(options: StudentFormOptions): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Aluno"
            subtitle="Insira as informações pessoais e acadêmicas para registrar o novo estudante no sistema."
            breadcrumbItems={studentBreadcrumb({ current: 'Cadastrar' })}
        >
            <StudentForm mode="create" options={options} />
        </BusinessPage>
    );
}
