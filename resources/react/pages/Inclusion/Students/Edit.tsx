import StudentForm from '@/components/Inclusion/Students/Form/StudentForm';
import { studentBreadcrumb } from '@/components/Inclusion/Students/Students.routes';
import type { StudentEditProps } from '@/components/Inclusion/Students/Students.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function StudentsEdit({ student, ...options }: StudentEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title={`Editar ${student.person.name}`}
            subtitle="Atualize as informações cadastrais e acadêmicas do estudante."
            breadcrumbItems={studentBreadcrumb({ student, current: 'Editar' })}
        >
            <StudentForm key={student.id} mode="edit" options={options} student={student} />
        </BusinessPage>
    );
}
