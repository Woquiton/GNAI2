import BarrierDeleteModal from '@/components/Inclusion/Barriers/BarrierDeleteModal';
import { emptyBarrierFilters } from '@/components/Inclusion/Barriers/Barriers.constants';
import { barrierBreadcrumb, barrierUrls } from '@/components/Inclusion/Barriers/Barriers.routes';
import type {
    BarrierIndexProps,
    BarrierRecord,
} from '@/components/Inclusion/Barriers/Barriers.types';
import { barrierListTour } from '@/components/Inclusion/Barriers/barrierTours';
import BarrierFilters from '@/components/Inclusion/Barriers/List/BarrierFilters';
import BarrierList from '@/components/Inclusion/Barriers/List/BarrierList';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionBarriersIndexPage({
    barriers,
    filters: initialFilters,
    can,
}: BarrierIndexProps): React.JSX.Element {
    const filters = useTableListFilters({
        url: barrierUrls.index,
        initialFilters,
        emptyFilters: emptyBarrierFilters,
        failureText: 'Não foi possível atualizar as barreiras. Tente novamente.',
    });
    const removal = useConfirmedAction<BarrierRecord>({
        failureText: 'Não foi possível excluir a barreira. Tente novamente.',
    });

    function requestRemoval(barrier: BarrierRecord): void {
        filters.cancelScheduled();
        removal.open(barrier);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            removal.submit('delete', barrierUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Mapa de Barreiras"
            subtitle="Contribuições da comunidade para uma instituição mais acessível."
            breadcrumbItems={barrierBreadcrumb()}
            tour={barrierListTour}
            create={can.create && { href: barrierUrls.create, label: 'Relatar barreira' }}
            listLabel="Listagem de barreiras"
            loading={filters.loading}
            loadingLabel="Atualizando barreiras"
            filters={
                <BarrierFilters
                    values={filters.values}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <BarrierDeleteModal
                    barrier={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <BarrierList
                barriers={barriers}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={requestRemoval}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
