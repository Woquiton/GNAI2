import WaitlistEditForm from '@/components/Inclusion/Waitlists/Form/WaitlistEditForm';
import { waitlistBreadcrumb } from '@/components/Inclusion/Waitlists/Waitlists.routes';
import type { WaitlistEditProps } from '@/components/Inclusion/Waitlists/Waitlists.types';
import { waitlistEditTour } from '@/components/Inclusion/Waitlists/waitlistTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionWaitlistsEditPage({
    waitlist,
    authUser,
    statusLabel,
    can,
}: WaitlistEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Solicitação de Fila"
            subtitle="Atualize as informações. Os dados de identificação permanecem bloqueados para preservar o histórico."
            breadcrumbItems={waitlistBreadcrumb({ waitlist, current: 'Editar' })}
            tour={waitlistEditTour}
        >
            <WaitlistEditForm
                key={waitlist.id}
                waitlist={waitlist}
                authUser={authUser}
                statusLabel={statusLabel}
                canSubmit={can.submit}
            />
        </BusinessPage>
    );
}
