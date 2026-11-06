import StudentDeficiencyForm from '@/components/StudentDeficiencies/Form/StudentDeficiencyForm';
import { studentDeficiencyBreadcrumb } from '@/components/StudentDeficiencies/StudentDeficiencies.routes';
import type { StudentDeficiencyCreateProps } from '@/components/StudentDeficiencies/StudentDeficiencies.types';
import { studentDeficiencyCreateTour } from '@/components/StudentDeficiencies/studentDeficiencyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function StudentDeficienciesCreatePage({
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
