import GuardianForm from '@/components/Inclusion/Guardians/Form/GuardianForm';
import { guardianBreadcrumb } from '@/components/Inclusion/Guardians/Guardians.routes';
import type { GuardianEditProps } from '@/components/Inclusion/Guardians/Guardians.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionGuardiansEditPage(props: GuardianEditProps): React.JSX.Element {
    const { student, guardian } = props;

    return (
        <BusinessPage
            title="Editar Responsável"
            subtitle={`Editando vínculo de: ${guardian.person.name}`}
            breadcrumbItems={guardianBreadcrumb({ student, guardian, current: 'Editar' })}
        >
            <GuardianForm key={guardian.id} mode="edit" {...props} />
        </BusinessPage>
    );
}
