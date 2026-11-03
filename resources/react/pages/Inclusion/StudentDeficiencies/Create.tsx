import StudentDeficiencyForm from '@/components/Inclusion/StudentDeficiencies/Form/StudentDeficiencyForm';
import { studentDeficiencyBreadcrumb } from '@/components/Inclusion/StudentDeficiencies/StudentDeficiencies.routes';
import type { StudentDeficiencyCreateProps } from '@/components/Inclusion/StudentDeficiencies/StudentDeficiencies.types';
import { studentDeficiencyCreateTour } from '@/components/Inclusion/StudentDeficiencies/studentDeficiencyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionStudentDeficienciesCreatePage({
    student,
    deficienciesList,
}: StudentDeficiencyCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Vincular Perfil de Atendimento"
            subtitle={`Aluno: ${student.person.name}`}
            breadcrumbItems={studentDeficiencyBreadcrumb({
                student,
                current: 'Cadastrar perfil de atendimento',
            })}
            tour={studentDeficiencyCreateTour}
        >
            <StudentDeficiencyForm
                mode="create"
                student={student}
                deficiencies={deficienciesList}
            />
        </BusinessPage>
    );
}
