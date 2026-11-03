import InlineMetricsCard from '@/components/UI/InlineMetricsCard/InlineMetricsCard';
import BarrierMap from './BarrierMap';
import MetricsChart from './MetricsChart';
import type { OverviewProps } from './Overview.types';
import { OVERVIEW_TOUR_TARGETS } from './overviewTour';
import { radarStats } from './Overview.utils';
import './Overview.css';

interface InclusiveRadarOverviewProps {
    radar: OverviewProps['inclusiveRadar'];
}

/** Parte do Radar inclusivo no painel: indicadores, status das barreiras e mapa. */
export default function InclusiveRadarOverview({
    radar,
}: InclusiveRadarOverviewProps): React.JSX.Element {
    return (
        <>
            <InlineMetricsCard
                className="gnaiDashboard__radarMetrics"
                label="Indicadores do Radar inclusivo"
                tourTarget={OVERVIEW_TOUR_TARGETS.radarStats}
                items={radarStats(radar).map((stat) => ({
                    label: stat.title,
                    value: stat.value,
                    iconClass: `fa fa-${stat.icon}`,
                    tone: stat.tone,
                    href: stat.href,
                }))}
            />
            <div className="gnaiDashboard__charts gnaiDashboard__charts--map">
                <MetricsChart
                    title="Status das barreiras"
                    items={radar.barrierStatusCounts}
                    total={radar.totalBarriers}
                    tourTarget={OVERVIEW_TOUR_TARGETS.barrierStatus}
                />
                <BarrierMap barriers={radar.mapBarriers} />
            </div>
        </>
    );
}
