import SessionCancelModal from '@/components/Sessions/Details/SessionCancelModal';
import SessionDetails from '@/components/Sessions/Details/SessionDetails';
import SessionDetailsActions from '@/components/Sessions/Details/SessionDetailsActions';
import {
    useSessionCancellation,
} from '@/components/Sessions/Details/useSessionCancellation';
import SessionDeleteModal from '@/components/Sessions/SessionDeleteModal';
import { sessionBreadcrumb } from '@/components/Sessions/Sessions.routes';
import type { SessionShowProps } from '@/components/Sessions/Sessions.types';
import { useSessionRemoval } from '@/components/Sessions/useSessionRemoval';
import { sessionShowTour } from '@/components/Sessions/sessionTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function SessionsShowPage({
    session,
    record,
    can,
    backUrl,
}: SessionShowProps): React.JSX.Element {
    const removal = useSessionRemoval();
    const cancellation = useSessionCancellation(session.id, removal.processing || !can.cancel);
    const busy = removal.processing || cancellation.form.processing;

    function openRemoval(): void {
        if (!busy) {
            removal.open(session);
        }
    }

    function confirmRemoval(): void {
        if (!cancellation.form.processing) {
            removal.confirm();
        }
    }

    return (
        <BusinessPage
            title="Detalhes do Agendamento"
            subtitle="Informações detalhadas do atendimento especializado."
            breadcrumbItems={sessionBreadcrumb({ session })}
            busy={busy}
            tour={sessionShowTour}
        >
            <SessionDetails session={session} />
            <SessionDetailsActions
                sessionId={session.id}
                record={record}
                permissions={can}
                backUrl={backUrl}
                busy={busy}
                onCancel={cancellation.open}
                onDelete={openRemoval}
            />
            {can.cancel ? <SessionCancelModal cancellation={cancellation} /> : null}
            {can.delete ? (
                <SessionDeleteModal
                    session={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            ) : null}
        </BusinessPage>
    );
}
