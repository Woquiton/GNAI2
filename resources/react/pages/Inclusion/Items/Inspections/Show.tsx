import { InspectionDateBadge } from '@/components/Inclusion/Inspections/InspectionDetails/InspectionDetails';
import ItemInspectionDetails from '@/components/Inclusion/Items/Details/ItemInspectionDetails';
import { itemInspectionShowTour } from '@/components/Inclusion/Inspections/inspectionTours';
import { itemBreadcrumb } from '@/components/Inclusion/Items/Items.routes';
import type { ItemInspectionShowProps } from '@/components/Inclusion/Items/Items.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionItemsInspectionsShowPage({
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
