import GuardianForm from '@/components/Guardians/Form/GuardianForm';
import { guardianBreadcrumb } from '@/components/Guardians/Guardians.routes';
import type { GuardianCreateProps } from '@/components/Guardians/Guardians.types';
import { guardianCreateTour } from '@/components/Guardians/guardianTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function GuardiansCreatePage(
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
