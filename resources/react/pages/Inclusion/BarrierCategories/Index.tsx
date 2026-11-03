import { usePage } from '@inertiajs/react';
import { emptyBarrierCategoryFilters } from '@/components/Inclusion/BarrierCategories/BarrierCategories.constants';
import {
    barrierCategoryBreadcrumb,
    barrierCategoryUrls,
} from '@/components/Inclusion/BarrierCategories/BarrierCategories.routes';
import type {
    BarrierCategoryIndexProps,
    BarrierCategoryRecord,
} from '@/components/Inclusion/BarrierCategories/BarrierCategories.types';
import { barrierCategoryListTour } from '@/components/Inclusion/BarrierCategories/barrierCategoryTours';
import BarrierCategoryDeleteModal from '@/components/Inclusion/BarrierCategories/BarrierCategoryDeleteModal';
import BarrierCategoryFilters from '@/components/Inclusion/BarrierCategories/List/BarrierCategoryFilters';
import BarrierCategoryList from '@/components/Inclusion/BarrierCategories/List/BarrierCategoryList';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionBarrierCategoriesIndexPage({
    categories,
    filters: initialFilters,
    can,
}: BarrierCategoryIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: barrierCategoryUrls.index,
        initialFilters,
        emptyFilters: emptyBarrierCategoryFilters,
        failureText: 'Não foi possível atualizar as categorias de barreiras. Tente novamente.',
    });
    const removal = useConfirmedAction<BarrierCategoryRecord>({
        failureText: 'Não foi possível excluir a categoria. Tente novamente.',
    });

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', barrierCategoryUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Categorias de Barreiras"
            subtitle="Classificação para o mapeamento de acessibilidade e identificação de obstáculos."
            tour={barrierCategoryListTour}
            breadcrumbItems={barrierCategoryBreadcrumb()}
            create={
                can.create && {
                    href: barrierCategoryUrls.create,
                    label: 'Cadastrar categoria de barreira',
                }
            }
            listLabel="Listagem de categorias de barreiras"
            loading={filters.loading}
            loadingLabel="Atualizando categorias de barreiras"
            filters={
                <BarrierCategoryFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <BarrierCategoryDeleteModal
                    category={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <BarrierCategoryList
                categories={categories}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
