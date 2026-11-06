import SessionWorkspace from '@/components/Sessions/List/SessionWorkspace';
import SessionWorkspaceActions from '@/components/Sessions/List/SessionWorkspaceActions';
import { sessionIndexFailureText } from '@/components/Sessions/Sessions.constants';
import { sessionBreadcrumb, sessionUrls } from '@/components/Sessions/Sessions.routes';
import type { SessionIndexProps } from '@/components/Sessions/Sessions.types';
import { sessionIndexTour } from '@/components/Sessions/sessionTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function SessionsIndexPage({
    sessions,
    calendar,
    filters,
    options,
    can,
    view,
}: SessionIndexProps): React.JSX.Element {
    const actions =
        can.create || can.mySessions ? (
            <SessionWorkspaceActions
                shortcut={
                    can.mySessions && {
                        href: sessionUrls.mySessions,
                        label: 'Meus agendamentos',
                        title: 'Meus agendamentos',
                        iconClass: 'fa fa-clock-o',
                    }
                }
                canCreate={can.create}
            />
        ) : undefined;

    return (
        <BusinessPage
            title="Agendamentos"
            subtitle="Acompanhe os atendimentos do NAPNE no calendário ou em formato de lista."
            breadcrumbItems={sessionBreadcrumb()}
            actions={actions}
            tour={sessionIndexTour}
        >
            <SessionWorkspace
                baseUrl={sessionUrls.index}
                sessions={sessions}
                calendar={calendar}
                filters={filters}
                options={options}
                view={view}
                canView={can.view}
                label="Central de agendamentos"
                failureText={sessionIndexFailureText}
            />
        </BusinessPage>
    );
}
