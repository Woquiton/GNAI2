import LocationForm from '@/components/Inclusion/Locations/Form/LocationForm';
import { locationBreadcrumb } from '@/components/Inclusion/Locations/Locations.routes';
import type { LocationCreateProps } from '@/components/Inclusion/Locations/Locations.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionLocationsCreatePage(
    options: LocationCreateProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Ponto de Referência"
            subtitle="Vincule prédios ou áreas específicas a uma instituição base."
            breadcrumbItems={locationBreadcrumb({ current: 'Cadastrar' })}
        >
            <LocationForm options={options} />
        </BusinessPage>
    );
}
