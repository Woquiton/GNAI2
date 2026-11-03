import GuardianForm from '@/components/Inclusion/Guardians/Form/GuardianForm';
import { guardianBreadcrumb } from '@/components/Inclusion/Guardians/Guardians.routes';
import type { GuardianCreateProps } from '@/components/Inclusion/Guardians/Guardians.types';
import { guardianCreateTour } from '@/components/Inclusion/Guardians/guardianTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionGuardiansCreatePage(
    props: GuardianCreateProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Responsável"
            subtitle={`Aluno: ${props.student.person.name}`}
            breadcrumbItems={guardianBreadcrumb({ student: props.student, current: 'Cadastrar' })}
            tour={guardianCreateTour}
        >
            <GuardianForm mode="create" {...props} />
        </BusinessPage>
    );
}
