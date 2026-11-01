import GuardianForm from '@/components/Inclusion/Guardians/Form/GuardianForm';
import { guardianBreadcrumb } from '@/components/Inclusion/Guardians/Guardians.routes';
import type { GuardianCreateProps } from '@/components/Inclusion/Guardians/Guardians.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionGuardiansCreatePage(
    props: GuardianCreateProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Responsável"
            subtitle={`Aluno: ${props.student.person.name}`}
            breadcrumbItems={guardianBreadcrumb({ student: props.student, current: 'Cadastrar' })}
        >
            <GuardianForm mode="create" {...props} />
        </BusinessPage>
    );
}
