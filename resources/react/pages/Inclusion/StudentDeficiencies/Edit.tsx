import StudentDeficiencyForm from '@/components/Inclusion/StudentDeficiencies/Form/StudentDeficiencyForm';
import { studentDeficiencyBreadcrumb } from '@/components/Inclusion/StudentDeficiencies/StudentDeficiencies.routes';
import type { StudentDeficiencyEditProps } from '@/components/Inclusion/StudentDeficiencies/StudentDeficiencies.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionStudentDeficienciesEditPage({
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
