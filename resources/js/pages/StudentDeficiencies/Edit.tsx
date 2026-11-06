import StudentDeficiencyForm from '@/components/StudentDeficiencies/Form/StudentDeficiencyForm';
import { studentDeficiencyBreadcrumb } from '@/components/StudentDeficiencies/StudentDeficiencies.routes';
import type { StudentDeficiencyEditProps } from '@/components/StudentDeficiencies/StudentDeficiencies.types';
import { studentDeficiencyEditTour } from '@/components/StudentDeficiencies/studentDeficiencyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function StudentDeficienciesEditPage({
    student,
    student_deficiency: studentDeficiency,
}: StudentDeficiencyEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Perfil de Atendimento do Aluno"
            subtitle={`Aluno: ${student.person.name}`}
            breadcrumbItems={studentDeficiencyBreadcrumb({
                student,
                studentDeficiency,
                current: 'Editar',
            })}
            tour={studentDeficiencyEditTour}
        >
            <StudentDeficiencyForm
                key={studentDeficiency.id}
                mode="edit"
                student={student}
                studentDeficiency={studentDeficiency}
            />
        </BusinessPage>
    );
}
