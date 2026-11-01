import { deficiencyDescription } from '@/components/Inclusion/Deficiencies/Deficiencies.constants';
import { deficiencyBreadcrumb } from '@/components/Inclusion/Deficiencies/Deficiencies.routes';
import DeficiencyForm from '@/components/Inclusion/Deficiencies/Form/DeficiencyForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionDeficienciesCreatePage(): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Novo Perfil de Atendimento"
            subtitle={deficiencyDescription}
            breadcrumbItems={deficiencyBreadcrumb({ current: 'Cadastrar' })}
        >
            <DeficiencyForm />
        </BusinessPage>
    );
}
