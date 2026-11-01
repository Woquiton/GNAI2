import SessionForm from '@/components/Inclusion/Sessions/Form/SessionForm';
import { sessionBreadcrumb } from '@/components/Inclusion/Sessions/Sessions.routes';
import type { SessionCreateProps } from '@/components/Inclusion/Sessions/Sessions.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionSessionsCreatePage(props: SessionCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Agendamento"
            subtitle="Preencha os dados para agendar o atendimento especializado."
            breadcrumbItems={sessionBreadcrumb({ current: 'Cadastrar' })}
        >
            <SessionForm mode="create" {...props} />
        </BusinessPage>
    );
}
