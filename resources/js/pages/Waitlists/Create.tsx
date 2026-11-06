import WaitlistCreateForm from '@/components/Waitlists/Form/WaitlistCreateForm';
import { waitlistBreadcrumb } from '@/components/Waitlists/Waitlists.routes';
import type { WaitlistCreateProps } from '@/components/Waitlists/Waitlists.types';
import { waitlistCreateTour } from '@/components/Waitlists/waitlistTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function WaitlistsCreatePage(
    props: WaitlistCreateProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Nova Solicitação de Fila"
            subtitle="Registre um beneficiário para um recurso atualmente indisponível. Selecione apenas um: aluno ou profissional."
            breadcrumbItems={waitlistBreadcrumb({ current: 'Cadastrar' })}
            tour={waitlistCreateTour}
        >
            <WaitlistCreateForm {...props} />
        </BusinessPage>
    );
}
