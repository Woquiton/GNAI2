import ItemForm from '@/components/Inclusion/Items/Form/ItemForm';
import { itemBreadcrumb } from '@/components/Inclusion/Items/Items.routes';
import type { ItemEditProps } from '@/components/Inclusion/Items/Items.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionItemsEditPage({
    item,
    activeLoans,
    ...options
}: ItemEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Item"
            subtitle={`Atualizando informações de: ${item.name}`}
            breadcrumbItems={itemBreadcrumb({ item, current: 'Editar' })}
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
