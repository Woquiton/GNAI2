import BarrierDeleteModal from '@/components/Inclusion/Barriers/BarrierDeleteModal';
import { barrierBreadcrumb, barrierUrls } from '@/components/Inclusion/Barriers/Barriers.routes';
import type {
    BarrierRecord,
    BarrierShowProps,
} from '@/components/Inclusion/Barriers/Barriers.types';
import BarrierDetails from '@/components/Inclusion/Barriers/Details/BarrierDetails';
import BarrierDetailsActions from '@/components/Inclusion/Barriers/Details/BarrierDetailsActions';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionBarriersShowPage({
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
