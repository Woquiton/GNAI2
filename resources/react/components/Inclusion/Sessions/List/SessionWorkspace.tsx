import PageTabs from '@/components/Navigation/PageTabs/PageTabs';
import { TableListCard, useTableListVisit } from '@/components/Tables/TableList/TableList';
import { pickSessionWorkspaceFilters, sessionViews } from '../Sessions.constants';
import type {
    SessionCalendarData,
    SessionListFilters,
    SessionListOptions,
    SessionListPaginator,
    SessionView,
    SessionWorkspaceFilterValues,
} from '../Sessions.types';
import SessionCalendar from './SessionCalendar';
import SessionList from './SessionList';
import SessionWorkspaceFilters from './SessionWorkspaceFilters';

interface SessionWorkspaceProps {
    baseUrl: string;
    sessions: SessionListPaginator;
    calendar: SessionCalendarData;
    filters: SessionListFilters;
    options: SessionListOptions;
    view: SessionView;
    canView: boolean;
    showProfessional?: boolean;
    label: string;
    failureText: string;
}

function viewUrl(
    baseUrl: string,
    view: SessionView,
    filters: SessionWorkspaceFilterValues,
): string {
    const query = new URLSearchParams({ view });

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            query.set(key, value);
        }
    });

    return `${baseUrl}?${query.toString()}`;
}

/** Abas, filtros compartilhados e visualização em calendário ou listagem dos agendamentos. */
export default function SessionWorkspace({
    baseUrl,
    sessions,
    calendar,
    filters,
    options,
    view,
    canView,
    showProfessional = true,
    label,
    failureText,
}: SessionWorkspaceProps): React.JSX.Element {
    const list = useTableListVisit({ url: baseUrl, failureText });
    const activeFilters = pickSessionWorkspaceFilters(filters);
    const tabs = sessionViews.map((item) => ({
        ...item,
        href: viewUrl(baseUrl, item.key, activeFilters),
    }));
    const content =
        view === 'calendar' ? (
            <SessionCalendar
                calendar={calendar}
                referenceDate={filters.week}
                canView={canView}
                onReferenceDate={(date) =>
                    list.visit({ ...activeFilters, week: date }, 1, { view: 'calendar' })
                }
            />
        ) : (
            <SessionList
                sessions={sessions}
                canView={canView}
                showStudents
                showProfessional={showProfessional}
                showTime
                loading={list.loading}
                onPage={(page) => list.visit(activeFilters, page, { view: 'list' })}
            />
        );

    return (
        <>
            <PageTabs
                items={tabs}
                activeKey={view}
                ariaLabel={`Visualizações de ${label.toLowerCase()}`}
                preserveState
            />
            <TableListCard
                aria-label={label}
                loading={list.loading}
                loadingLabel={`Atualizando ${label.toLowerCase()}`}
            >
                <SessionWorkspaceFilters
                    filters={filters}
                    options={options}
                    showProfessional={showProfessional}
                    onSearch={(values) => list.visit(values, 1, { view })}
                />
                {content}
            </TableListCard>
        </>
    );
}
