import WaitlistCancelModal from '@/components/Waitlists/Details/WaitlistCancelModal';
import WaitlistDetails from '@/components/Waitlists/Details/WaitlistDetails';
import WaitlistDetailsActions from '@/components/Waitlists/Details/WaitlistDetailsActions';
import WaitlistDeleteModal from '@/components/Waitlists/WaitlistDeleteModal';
import {
    waitlistBreadcrumb,
    waitlistUrls,
} from '@/components/Waitlists/Waitlists.routes';
import type {
    WaitlistRecord,
    WaitlistShowProps,
} from '@/components/Waitlists/Waitlists.types';
import { waitlistShowTour } from '@/components/Waitlists/waitlistTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function WaitlistsShowPage({
    waitlist,
    canCancel,
    statusLabel,
    statusColor,
    can,
}: WaitlistShowProps): React.JSX.Element {
    const cancellation = useConfirmedAction<WaitlistRecord>({
        failureText: 'Não foi possível cancelar a solicitação. Tente novamente.',
    });
    const removal = useConfirmedAction<WaitlistRecord>({
        failureText: 'Não foi possível excluir a solicitação. Tente novamente.',
    });
    const processing = cancellation.processing || removal.processing;

    return (
        <BusinessPage
            title="Detalhes da Fila de Espera"
            subtitle="Visualize as informações da solicitação, o status e o histórico do recurso."
            documentTitle={`Solicitação #${waitlist.id}`}
            breadcrumbItems={waitlistBreadcrumb({ waitlist })}
            busy={processing}
            tour={waitlistShowTour}
        >
            <WaitlistDetails
                waitlist={waitlist}
                statusLabel={statusLabel}
                statusColor={statusColor}
            />
            <WaitlistDetailsActions
                waitlistId={waitlist.id}
                permissions={can}
                cancellable={canCancel}
                processing={processing}
                onCancel={() => cancellation.open(waitlist)}
                onDelete={() => removal.open(waitlist)}
            />
            <WaitlistCancelModal
                waitlist={cancellation.target}
                processing={cancellation.processing}
                onClose={cancellation.close}
                onConfirm={() => cancellation.submit('patch', waitlistUrls.cancel(waitlist.id))}
            />
            <WaitlistDeleteModal
                waitlist={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', waitlistUrls.destroy(waitlist.id))}
            />
        </BusinessPage>
    );
}
