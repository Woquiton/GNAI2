import ItemForm from '@/components/Items/Form/ItemForm';
import { itemBreadcrumb } from '@/components/Items/Items.routes';
import type { ItemCreateProps } from '@/components/Items/Items.types';
import { itemCloneTour, itemCreateTour } from '@/components/Items/itemTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function ItemsCreatePage({
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
