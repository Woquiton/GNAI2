import PendencyCompleteModal from '@/components/Inclusion/Pendencies/Details/PendencyCompleteModal';
import PendencyDetails from '@/components/Inclusion/Pendencies/Details/PendencyDetails';
import PendencyDetailsActions from '@/components/Inclusion/Pendencies/Details/PendencyDetailsActions';
import PendencyDeleteModal from '@/components/Inclusion/Pendencies/PendencyDeleteModal';
import {
    pendencyBreadcrumb,
    pendencyUrls,
} from '@/components/Inclusion/Pendencies/Pendencies.routes';
import type {
    PendencyDetailsRecord,
    PendencyShowProps,
} from '@/components/Inclusion/Pendencies/Pendencies.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionPendenciesShowPage({
    pendency,
    can,
}: PendencyShowProps): React.JSX.Element {
    const completion = useConfirmedAction<PendencyDetailsRecord>({
        failureText: 'Não foi possível concluir a pendência. Tente novamente.',
    });
    const removal = useConfirmedAction<PendencyDetailsRecord>({
        failureText: 'Não foi possível excluir a pendência. Tente novamente.',
    });
    const processing = completion.processing || removal.processing;

    return (
        <BusinessPage
            title={`Pendência, ${pendency.title}`}
            subtitle="Detalhes completos da pendência."
            breadcrumbItems={pendencyBreadcrumb({
                record: { id: pendency.id, label: pendency.title },
            })}
            busy={processing}
        >
            <PendencyDetails pendency={pendency} />
            <PendencyDetailsActions
                pendencyId={pendency.id}
                permissions={can}
                processing={processing}
                onComplete={() => completion.open(pendency)}
                onDelete={() => removal.open(pendency)}
            />
            <PendencyCompleteModal
                open={completion.target !== null}
                processing={completion.processing}
                onClose={completion.close}
                onConfirm={() => completion.submit('put', pendencyUrls.complete(pendency.id))}
            />
            <PendencyDeleteModal
                pendency={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', pendencyUrls.destroy(pendency.id))}
            />
        </BusinessPage>
    );
}
