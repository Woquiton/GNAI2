import LocationForm from '@/components/Inclusion/Locations/Form/LocationForm';
import { locationEditTour } from '@/components/Inclusion/Locations/locationTours';
import { locationBreadcrumb } from '@/components/Inclusion/Locations/Locations.routes';
import type { LocationEditProps } from '@/components/Inclusion/Locations/Locations.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionLocationsEditPage({
    location,
    ...options
}: LocationEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Ponto de Referência"
            subtitle={`Atualize as informações de ${location.name}.`}
            breadcrumbItems={locationBreadcrumb({ location, current: 'Editar' })}
            tour={locationEditTour}
        >
            <LocationForm key={location.id} options={options} location={location} />
        </BusinessPage>
    );
}
