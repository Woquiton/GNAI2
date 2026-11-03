import ItemForm from '@/components/Inclusion/Items/Form/ItemForm';
import { itemBreadcrumb } from '@/components/Inclusion/Items/Items.routes';
import type { ItemCreateProps } from '@/components/Inclusion/Items/Items.types';
import { itemCloneTour, itemCreateTour } from '@/components/Inclusion/Items/itemTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionItemsCreatePage({
    cloneSource,
    ...options
}: ItemCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title={cloneSource ? 'Clonar Item' : 'Novo Item'}
            subtitle="Cadastre tecnologias assistivas ou materiais pedagógicos acessíveis e realize a vistoria inicial."
            breadcrumbItems={itemBreadcrumb({ current: 'Cadastrar' })}
            tour={cloneSource ? itemCloneTour : itemCreateTour}
        >
            <ItemForm mode="create" options={options} cloneSource={cloneSource} />
        </BusinessPage>
    );
}
