import StudentForm from '@/components/Students/Form/StudentForm';
import { studentBreadcrumb } from '@/components/Students/Students.routes';
import type { StudentEditProps } from '@/components/Students/Students.types';
import { studentEditTour } from '@/components/Students/studentTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function StudentsEdit({ student, ...options }: StudentEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title={`Editar ${student.person.name}`}
            subtitle="Atualize as informações cadastrais e acadêmicas do estudante."
            breadcrumbItems={studentBreadcrumb({ student, current: 'Editar' })}
            tour={studentEditTour}
        >
            <StudentForm key={student.id} mode="edit" options={options} student={student} />
        </BusinessPage>
    );
}
