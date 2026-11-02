import InspectionDetails, {
    InspectionDateBadge,
} from '@/components/Inclusion/Inspections/InspectionDetails/InspectionDetails';
import { itemBreadcrumb, itemUrls } from '@/components/Inclusion/Items/Items.routes';
import type { ItemInspectionShowProps } from '@/components/Inclusion/Items/Items.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionItemsInspectionsShowPage({
    item,
    inspection,
}: ItemInspectionShowProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Detalhes da Inspeção"
            subtitle="Visualize o estado de conservação, o tipo, o parecer técnico e as evidências da vistoria."
            breadcrumbItems={itemBreadcrumb({ item, current: 'Detalhes da Inspeção' })}
            actions={<InspectionDateBadge date={inspection.date} />}
        >
            <InspectionDetails
                inspection={inspection}
                subject={{ name: item.name, href: itemUrls.show(item.id) }}
            />
        </BusinessPage>
    );
}
