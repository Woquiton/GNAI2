import SessionForm from '@/components/Sessions/Form/SessionForm';
import { sessionBreadcrumb } from '@/components/Sessions/Sessions.routes';
import type { SessionEditProps } from '@/components/Sessions/Sessions.types';
import { sessionEditTour } from '@/components/Sessions/sessionTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function SessionsEditPage(props: SessionEditProps): React.JSX.Element {
    const { session } = props;

    return (
        <BusinessPage
            title={`Editar Agendamento #${session.id}`}
            subtitle="Ajuste os dados de agendamento, local ou objetivo deste agendamento."
            breadcrumbItems={sessionBreadcrumb({ session, current: 'Editar' })}
            tour={sessionEditTour}
        >
            <SessionForm key={session.id} mode="edit" {...props} />
        </BusinessPage>
    );
}
