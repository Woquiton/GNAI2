import BarrierDeleteModal from '@/components/Barriers/BarrierDeleteModal';
import { barrierBreadcrumb, barrierUrls } from '@/components/Barriers/Barriers.routes';
import type {
    BarrierRecord,
    BarrierShowProps,
} from '@/components/Barriers/Barriers.types';
import { barrierShowTour } from '@/components/Barriers/barrierTours';
import BarrierDetails from '@/components/Barriers/Details/BarrierDetails';
import BarrierDetailsActions from '@/components/Barriers/Details/BarrierDetailsActions';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function BarriersShowPage({
    barrier,
    display,
    can,
}: BarrierShowProps): React.JSX.Element {
    const removal = useConfirmedAction<BarrierRecord>({
        failureText: 'Não foi possível excluir a barreira. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes da Barreira"
            subtitle={`Visualize as informações cadastradas e o histórico de vistorias: ${barrier.name}`}
            documentTitle={barrier.name}
            breadcrumbItems={barrierBreadcrumb({ barrier })}
            busy={removal.processing}
            tour={barrierShowTour}
        >
            <BarrierDetails
                barrier={barrier}
                display={display}
                showInspections={can.inspectionShow}
            />
            <BarrierDetailsActions
                barrierId={barrier.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(barrier)}
            />
            <BarrierDeleteModal
                barrier={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', barrierUrls.destroy(barrier.id))}
            />
        </BusinessPage>
    );
}
