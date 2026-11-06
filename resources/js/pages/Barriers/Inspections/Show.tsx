import { barrierBreadcrumb } from '@/components/Barriers/Barriers.routes';
import type { BarrierInspectionShowProps } from '@/components/Barriers/Barriers.types';
import BarrierInspectionDetails from '@/components/Barriers/Details/BarrierInspectionDetails';
import { barrierInspectionShowTour } from '@/components/Inspections/inspectionTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function BarrierInspectionShowPage(
    props: BarrierInspectionShowProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Detalhes da Inspeção"
            subtitle="Visualize o status da barreira, parecer técnico e evidências coletadas."
            breadcrumbItems={barrierBreadcrumb({
                barrier: props.barrier,
                current: 'Detalhes da Inspeção',
            })}
            tour={barrierInspectionShowTour}
        >
            <BarrierInspectionDetails {...props} />
        </BusinessPage>
    );
}
