import { deficiencyBreadcrumb } from '@/components/Deficiencies/Deficiencies.routes';
import type { DeficiencyEditProps } from '@/components/Deficiencies/Deficiencies.types';
import DeficiencyForm from '@/components/Deficiencies/Form/DeficiencyForm';
import { deficiencyEditTour } from '@/components/Deficiencies/deficiencyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function DeficienciesEditPage({
    deficiency,
}: DeficiencyEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Perfil de Atendimento"
            subtitle={`Atualizando informações de: ${deficiency.name}`}
            breadcrumbItems={deficiencyBreadcrumb({ deficiency, current: 'Editar' })}
            tour={deficiencyEditTour}
        >
            <DeficiencyForm key={deficiency.id} deficiency={deficiency} />
        </BusinessPage>
    );
}
