import { barrierCategoryBreadcrumb } from '@/components/Inclusion/BarrierCategories/BarrierCategories.routes';
import type { BarrierCategoryEditProps } from '@/components/Inclusion/BarrierCategories/BarrierCategories.types';
import { barrierCategoryEditTour } from '@/components/Inclusion/BarrierCategories/barrierCategoryTours';
import BarrierCategoryForm from '@/components/Inclusion/BarrierCategories/Form/BarrierCategoryForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionBarrierCategoriesEditPage({
    barrierCategory,
    can,
}: BarrierCategoryEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Categoria de Barreira"
            subtitle={`Atualizando as definições da categoria: ${barrierCategory.name}`}
            tour={barrierCategoryEditTour}
            breadcrumbItems={barrierCategoryBreadcrumb({
                category: barrierCategory,
                current: 'Editar',
            })}
        >
            <BarrierCategoryForm
                key={barrierCategory.id}
                category={barrierCategory}
                canSubmit={can.update}
            />
        </BusinessPage>
    );
}
