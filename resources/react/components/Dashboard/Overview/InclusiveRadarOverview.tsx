import BarrierMap from './BarrierMap';
import MetricsChart from './MetricsChart';
import type { OverviewProps } from './Overview.types';
import { radarStats } from './Overview.utils';
import OverviewStatGrid from './OverviewStatGrid';
import './Overview.css';

interface InclusiveRadarOverviewProps {
    radar: OverviewProps['inclusiveRadar'];
}

/** Seção do Radar inclusivo: indicadores, status das barreiras e mapa. */
export default function InclusiveRadarOverview({
    radar,
}: InclusiveRadarOverviewProps): React.JSX.Element {
    return (
        <>
            <h2 className="gnaiDashboard__heading">Radar inclusivo</h2>
            <OverviewStatGrid stats={radarStats(radar)} radar />
            <div className="gnaiDashboard__charts gnaiDashboard__charts--map">
                <MetricsChart
                    title="Status das barreiras"
                    items={radar.barrierStatusCounts}
                    total={radar.totalBarriers}
                />
                <BarrierMap barriers={radar.mapBarriers} />
            </div>
        </>
    );
}
