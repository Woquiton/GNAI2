import ItemForm from '@/components/Items/Form/ItemForm';
import { itemBreadcrumb } from '@/components/Items/Items.routes';
import type { ItemEditProps } from '@/components/Items/Items.types';
import { itemEditTour } from '@/components/Items/itemTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function ItemsEditPage({
    item,
    activeLoans,
    ...options
}: ItemEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Item"
            subtitle={`Atualizando informações de: ${item.name}`}
            breadcrumbItems={itemBreadcrumb({ item, current: 'Editar' })}
            tour={itemEditTour}
        >
            <ItemForm
                key={item.id}
                mode="edit"
                options={options}
                item={item}
                activeLoans={activeLoans}
            />
        </BusinessPage>
    );
}
