import { deficiencyBreadcrumb } from '@/components/Inclusion/Deficiencies/Deficiencies.routes';
import type { DeficiencyEditProps } from '@/components/Inclusion/Deficiencies/Deficiencies.types';
import DeficiencyForm from '@/components/Inclusion/Deficiencies/Form/DeficiencyForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionDeficienciesEditPage({
    deficiency,
}: DeficiencyEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Perfil de Atendimento"
            subtitle={`Atualizando informações de: ${deficiency.name}`}
            breadcrumbItems={deficiencyBreadcrumb({ deficiency, current: 'Editar' })}
        >
            <DeficiencyForm key={deficiency.id} deficiency={deficiency} />
        </BusinessPage>
    );
}
