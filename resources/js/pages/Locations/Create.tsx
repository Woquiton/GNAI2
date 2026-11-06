import LocationForm from '@/components/Locations/Form/LocationForm';
import { locationCreateTour } from '@/components/Locations/locationTours';
import { locationBreadcrumb } from '@/components/Locations/Locations.routes';
import type { LocationCreateProps } from '@/components/Locations/Locations.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function LocationsCreatePage(
    options: LocationCreateProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Ponto de Referência"
            subtitle="Vincule prédios ou áreas específicas a uma instituição base."
            breadcrumbItems={locationBreadcrumb({ current: 'Cadastrar' })}
            tour={locationCreateTour}
        >
            <LocationForm options={options} />
        </BusinessPage>
    );
}
