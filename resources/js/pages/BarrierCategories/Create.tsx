import { barrierCategoryBreadcrumb } from '@/components/BarrierCategories/BarrierCategories.routes';
import type { BarrierCategoryCreateProps } from '@/components/BarrierCategories/BarrierCategories.types';
import { barrierCategoryCreateTour } from '@/components/BarrierCategories/barrierCategoryTours';
import BarrierCategoryForm from '@/components/BarrierCategories/Form/BarrierCategoryForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function BarrierCategoriesCreatePage({
    can,
}: BarrierCategoryCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Nova Categoria de Barreira"
            subtitle="Defina classificações para identificar obstáculos à acessibilidade."
            tour={barrierCategoryCreateTour}
            breadcrumbItems={barrierCategoryBreadcrumb({ current: 'Cadastrar' })}
        >
            <BarrierCategoryForm canSubmit={can.store} />
        </BusinessPage>
    );
}
