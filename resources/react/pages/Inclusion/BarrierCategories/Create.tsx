import { barrierCategoryBreadcrumb } from '@/components/Inclusion/BarrierCategories/BarrierCategories.routes';
import type { BarrierCategoryCreateProps } from '@/components/Inclusion/BarrierCategories/BarrierCategories.types';
import { barrierCategoryCreateTour } from '@/components/Inclusion/BarrierCategories/barrierCategoryTours';
import BarrierCategoryForm from '@/components/Inclusion/BarrierCategories/Form/BarrierCategoryForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionBarrierCategoriesCreatePage({
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
