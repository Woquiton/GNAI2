import StudentForm from '@/components/Students/Form/StudentForm';
import { studentBreadcrumb } from '@/components/Students/Students.routes';
import type { StudentFormOptions } from '@/components/Students/Students.types';
import { studentCreateTour } from '@/components/Students/studentTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function StudentsCreate(options: StudentFormOptions): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Aluno"
            subtitle="Insira as informações pessoais e acadêmicas para registrar o novo estudante no sistema."
            breadcrumbItems={studentBreadcrumb({ current: 'Cadastrar' })}
            tour={studentCreateTour}
        >
            <StudentForm mode="create" options={options} />
        </BusinessPage>
    );
}
