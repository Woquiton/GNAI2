import { usePage } from '@inertiajs/react';
import LocationFilters from '@/components/Inclusion/Locations/List/LocationFilters';
import LocationList from '@/components/Inclusion/Locations/List/LocationList';
import LocationDeleteModal from '@/components/Inclusion/Locations/LocationDeleteModal';
import { emptyLocationFilters } from '@/components/Inclusion/Locations/Locations.constants';
import {
    locationBreadcrumb,
    locationUrls,
} from '@/components/Inclusion/Locations/Locations.routes';
import type {
    LocationIndexProps,
    LocationRecord,
} from '@/components/Inclusion/Locations/Locations.types';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionLocationsIndexPage({
    locations,
    filters: initialFilters,
    can,
}: LocationIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: locationUrls.index,
        initialFilters,
        emptyFilters: emptyLocationFilters,
        failureText: 'Não foi possível atualizar os pontos de referência. Tente novamente.',
    });
    const removal = useConfirmedAction<LocationRecord>({
        failureText: 'Não foi possível excluir o ponto de referência. Tente novamente.',
    });

    function requestRemoval(location: LocationRecord): void {
        filters.cancelScheduled();
        removal.open(location);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            removal.submit('delete', locationUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Pontos de Referência"
            subtitle="Gerencie os prédios, salas e locais específicos dentro de cada instituição."
            breadcrumbItems={locationBreadcrumb()}
            create={
                can.create && { href: locationUrls.create, label: 'Cadastrar ponto de referência' }
            }
            listLabel="Listagem de pontos de referência"
            loading={filters.loading}
            loadingLabel="Atualizando pontos de referência"
            filters={
                <LocationFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <LocationDeleteModal
                    location={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <LocationList
                locations={locations}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={requestRemoval}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
