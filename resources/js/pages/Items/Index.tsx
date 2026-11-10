import { usePage } from '@inertiajs/react';
import ItemDeleteModal from '@/components/Items/ItemDeleteModal';
import { emptyItemFilters } from '@/components/Items/Items.constants';
import { itemBreadcrumb, itemUrls } from '@/components/Items/Items.routes';
import type { ItemIndexProps, ItemSummary } from '@/components/Items/Items.types';
import ItemFilters from '@/components/Items/List/ItemFilters';
import ItemResults from '@/components/Items/List/ItemResults';
import { itemListTour } from '@/components/Items/itemTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import {
    TableListCard,
    TableListCreateButton,
    useTableListFilters,
} from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function ItemsIndexPage({
    items,
    filters: initialFilters,
    itemTypeOptions,
    accessibilityFeatureOptions,
    deficiencyOptions,
    can,
}: ItemIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: itemUrls.index,
        initialFilters,
        emptyFilters: emptyItemFilters,
        failureText: 'Não foi possível concluir a operação. Tente novamente.',
    });
    const removal = useConfirmedAction<ItemSummary>({
        failureText: 'Não foi possível concluir a exclusão. Tente novamente.',
    });

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', itemUrls.destroy(removal.target.id));
        }
    }

    return (
        <BusinessPage
            title="Itens"
            subtitle="Gestão de tecnologias assistivas e materiais pedagógicos acessíveis."
            breadcrumbItems={itemBreadcrumb()}
            actions={
                can.create ? (
                    <TableListCreateButton href={itemUrls.create} ariaLabel="Cadastrar item" />
                ) : undefined
            }
            tour={itemListTour}
        >
            <TableListCard
                aria-label="Listagem de itens"
                loading={filters.loading}
                loadingLabel="Atualizando itens"
            >
                <ItemFilters
                    deficiencyOptions={deficiencyOptions}
                    values={filters.values}
                    itemTypeOptions={itemTypeOptions}
                    accessibilityFeatureOptions={accessibilityFeatureOptions}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
                <ItemResults
                    itemTypeFilter={initialFilters.item_type ?? ''}
                    onPageSizeSelect={(size) => {
                        filters.cancelScheduled();
                        filters.visit(filters.values, 1, { per_page: size });
                    }}
                    items={items}
                    permissions={can}
                    loading={filters.loading}
                    processing={removal.processing}
                    onDelete={removal.open}
                    onPageSelect={filters.selectPage}
                />
            </TableListCard>
            <ItemDeleteModal
                item={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={confirmRemoval}
            />
        </BusinessPage>
    );
}
