import SessionWorkspace from '@/components/Inclusion/Sessions/List/SessionWorkspace';
import SessionWorkspaceActions from '@/components/Inclusion/Sessions/List/SessionWorkspaceActions';
import { mySessionsFailureText } from '@/components/Inclusion/Sessions/Sessions.constants';
import { mySessionsBreadcrumb, sessionUrls } from '@/components/Inclusion/Sessions/Sessions.routes';
import type { SessionMySessionsProps } from '@/components/Inclusion/Sessions/Sessions.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionSessionsMySessionsPage({
    sessions,
    calendar,
    view,
    filters,
    options,
    can,
}: SessionMySessionsProps): React.JSX.Element {
    const actions =
        can.create || can.viewAll ? (
            <SessionWorkspaceActions
                shortcut={
                    can.viewAll && {
                        href: sessionUrls.index,
                        label: 'Todos Agendamentos',
                        title: 'Voltar para agendamentos',
                        iconClass: 'fa fa-calendar',
                    }
                }
                canCreate={can.create}
            />
        ) : undefined;

    return (
        <BusinessPage
            title="Meus Agendamentos"
            subtitle="Acompanhe os seus atendimentos no calendário ou em formato de lista."
            breadcrumbItems={mySessionsBreadcrumb(can.viewAll)}
            actions={actions}
        >
            <SessionWorkspace
                baseUrl={sessionUrls.mySessions}
                sessions={sessions}
                calendar={calendar}
                filters={filters}
                options={options}
                view={view}
                canView={can.view}
                showProfessional={false}
                label="Meus agendamentos"
                failureText={mySessionsFailureText}
            />
        </BusinessPage>
    );
}
