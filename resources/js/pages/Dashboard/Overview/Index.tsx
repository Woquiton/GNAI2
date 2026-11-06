import { usePage } from '@inertiajs/react';
import { dashboardBreadcrumb } from '@/components/Dashboard/Dashboard.routes';
import ActivityFeed from '@/components/Dashboard/Overview/ActivityFeed';
import InclusiveRadarOverview from '@/components/Dashboard/Overview/InclusiveRadarOverview';
import type {
    OverviewProps,
    OverviewSharedProps,
} from '@/components/Dashboard/Overview/Overview.types';
import { overviewWelcome, supportStats } from '@/components/Dashboard/Overview/Overview.utils';
import OverviewStatGrid from '@/components/Dashboard/Overview/OverviewStatGrid';
import { overviewTour } from '@/components/Dashboard/Overview/overviewTour';
import SupportOverviewCharts from '@/components/Dashboard/Overview/SupportOverviewCharts';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function Overview({
    specializedEducationalSupport,
    inclusiveRadar,
    activityFeed,
}: OverviewProps): React.JSX.Element {
    const { auth } = usePage<OverviewSharedProps>().props;

    return (
        <BusinessPage
            className="gnaiDashboard"
            title="Painel"
            subtitle={overviewWelcome(auth.user)}
            breadcrumbItems={dashboardBreadcrumb()}
            tour={overviewTour}
        >
            <OverviewStatGrid stats={supportStats(specializedEducationalSupport)} singleRow />
            <ActivityFeed feed={activityFeed} />
            <SupportOverviewCharts support={specializedEducationalSupport} />
            <InclusiveRadarOverview radar={inclusiveRadar} />
        </BusinessPage>
    );
}
