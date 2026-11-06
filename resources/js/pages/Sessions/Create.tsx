import SessionForm from '@/components/Sessions/Form/SessionForm';
import { sessionBreadcrumb } from '@/components/Sessions/Sessions.routes';
import type { SessionCreateProps } from '@/components/Sessions/Sessions.types';
import { sessionCreateTour } from '@/components/Sessions/sessionTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function SessionsCreatePage(props: SessionCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Agendamento"
            subtitle="Preencha os dados para agendar o atendimento especializado."
            breadcrumbItems={sessionBreadcrumb({ current: 'Cadastrar' })}
            tour={sessionCreateTour}
        >
            <SessionForm mode="create" {...props} />
        </BusinessPage>
    );
}
