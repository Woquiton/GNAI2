import { usePage } from '@inertiajs/react';
import ItemDeleteModal from '@/components/Inclusion/Items/ItemDeleteModal';
import { emptyItemFilters } from '@/components/Inclusion/Items/Items.constants';
import { itemBreadcrumb, itemUrls } from '@/components/Inclusion/Items/Items.routes';
import type { ItemIndexProps, ItemSummary } from '@/components/Inclusion/Items/Items.types';
import ItemFilters from '@/components/Inclusion/Items/List/ItemFilters';
import ItemList from '@/components/Inclusion/Items/List/ItemList';
import { itemListTour } from '@/components/Inclusion/Items/itemTours';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionItemsIndexPage({
    items,
    filters: initialFilters,
    itemTypeOptions,
    accessibilityFeatureOptions,
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
        <TableListLayout
            title="Itens"
            subtitle="Gestão de tecnologias assistivas e materiais pedagógicos acessíveis."
            breadcrumbItems={itemBreadcrumb()}
            create={can.create && { href: itemUrls.create, label: 'Cadastrar item' }}
            listLabel="Listagem de itens"
            loading={filters.loading}
            loadingLabel="Atualizando itens"
            tour={itemListTour}
            filters={
                <ItemFilters
                    values={filters.values}
                    itemTypeOptions={itemTypeOptions}
                    accessibilityFeatureOptions={accessibilityFeatureOptions}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <ItemDeleteModal
                    item={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <ItemList
                items={items}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
