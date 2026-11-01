import WaitlistCreateForm from '@/components/Inclusion/Waitlists/Form/WaitlistCreateForm';
import { waitlistBreadcrumb } from '@/components/Inclusion/Waitlists/Waitlists.routes';
import type { WaitlistCreateProps } from '@/components/Inclusion/Waitlists/Waitlists.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionWaitlistsCreatePage(
    props: WaitlistCreateProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Nova Solicitação de Fila"
            subtitle="Registre um beneficiário para um recurso atualmente indisponível. Selecione apenas um: aluno ou profissional."
            breadcrumbItems={waitlistBreadcrumb({ current: 'Cadastrar' })}
        >
            <WaitlistCreateForm {...props} />
        </BusinessPage>
    );
}
