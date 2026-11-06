import { InspectionDateBadge } from '@/components/Inspections/InspectionDetails/InspectionDetails';
import ItemInspectionDetails from '@/components/Items/Details/ItemInspectionDetails';
import { itemInspectionShowTour } from '@/components/Inspections/inspectionTours';
import { itemBreadcrumb } from '@/components/Items/Items.routes';
import type { ItemInspectionShowProps } from '@/components/Items/Items.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function ItemsInspectionsShowPage({
    item,
    inspection,
    cover,
    canSetCover,
}: ItemInspectionShowProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Detalhes da Inspeção"
            subtitle="Visualize o estado de conservação, o tipo, o parecer técnico e as evidências da vistoria."
            breadcrumbItems={itemBreadcrumb({ item, current: 'Detalhes da Inspeção' })}
            actions={<InspectionDateBadge date={inspection.date} />}
            tour={itemInspectionShowTour}
        >
            <ItemInspectionDetails
                item={item}
                inspection={inspection}
                cover={cover}
                canSetCover={canSetCover}
            />
        </BusinessPage>
    );
}
