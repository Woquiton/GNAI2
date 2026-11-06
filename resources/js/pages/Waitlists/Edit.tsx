import WaitlistEditForm from '@/components/Waitlists/Form/WaitlistEditForm';
import { waitlistBreadcrumb } from '@/components/Waitlists/Waitlists.routes';
import type { WaitlistEditProps } from '@/components/Waitlists/Waitlists.types';
import { waitlistEditTour } from '@/components/Waitlists/waitlistTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function WaitlistsEditPage({
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
