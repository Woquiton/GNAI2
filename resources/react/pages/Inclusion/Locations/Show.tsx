import LocationDetails from '@/components/Inclusion/Locations/Details/LocationDetails';
import LocationDetailsActions from '@/components/Inclusion/Locations/Details/LocationDetailsActions';
import LocationDeleteModal from '@/components/Inclusion/Locations/LocationDeleteModal';
import {
    locationBreadcrumb,
    locationUrls,
} from '@/components/Inclusion/Locations/Locations.routes';
import type {
    LocationRecord,
    LocationShowProps,
} from '@/components/Inclusion/Locations/Locations.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionLocationsShowPage({
    location,
    display,
    can,
}: LocationShowProps): React.JSX.Element {
    const removal = useConfirmedAction<LocationRecord>({
        failureText: 'Não foi possível excluir o ponto de referência. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes do Ponto de Referência"
            subtitle={`Visualize as informações cadastradas e a posição no mapa: ${location.name}`}
            documentTitle={location.name}
            breadcrumbItems={locationBreadcrumb({ location })}
            busy={removal.processing}
        >
            <LocationDetails location={location} display={display} />
            <LocationDetailsActions
                locationId={location.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(location)}
            />
            <LocationDeleteModal
                location={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', locationUrls.destroy(location.id))}
            />
        </BusinessPage>
    );
}
