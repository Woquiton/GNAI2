import {
    barrierCategoryBreadcrumb,
    barrierCategoryUrls,
} from '@/components/Inclusion/BarrierCategories/BarrierCategories.routes';
import type { BarrierCategoryShowProps } from '@/components/Inclusion/BarrierCategories/BarrierCategories.types';
import BarrierCategoryDeleteModal from '@/components/Inclusion/BarrierCategories/BarrierCategoryDeleteModal';
import BarrierCategoryDetails from '@/components/Inclusion/BarrierCategories/Details/BarrierCategoryDetails';
import BarrierCategoryDetailsActions from '@/components/Inclusion/BarrierCategories/Details/BarrierCategoryDetailsActions';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionBarrierCategoriesShowPage({
    barrierCategory: category,
    display,
    can,
}: BarrierCategoryShowProps): React.JSX.Element {
    const removal = useConfirmedAction<typeof category>({
        failureText: 'Não foi possível excluir a categoria. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes da Categoria de Barreira"
            subtitle={`Visualize as informações cadastrais da categoria: ${category.name}`}
            documentTitle={category.name}
            breadcrumbItems={barrierCategoryBreadcrumb({ category })}
            busy={removal.processing}
        >
            <BarrierCategoryDetails barrierCategory={category} display={display} />
            <BarrierCategoryDetailsActions
                categoryId={category.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(category)}
            />
            <BarrierCategoryDeleteModal
                category={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', barrierCategoryUrls.destroy(category.id))}
            />
        </BusinessPage>
    );
}
