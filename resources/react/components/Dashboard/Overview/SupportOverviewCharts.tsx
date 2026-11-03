import RevenueSummaryCard from '@/components/UI/RevenueSummaryCard/RevenueSummaryCard';
import DistributionChart from './DistributionChart';
import type { OverviewProps } from './Overview.types';
import { finishedPeisPercentage } from './Overview.utils';
import { OVERVIEW_TOUR_TARGETS } from './overviewTour';
import SessionsTimelineChart from './SessionsTimelineChart';
import './Overview.css';

interface SupportOverviewChartsProps {
    support: OverviewProps['specializedEducationalSupport'];
}

/** Gráficos do AEE: status dos PEIs, pendências por prioridade e agendamentos por status e por mês. */
export default function SupportOverviewCharts({
    support,
}: SupportOverviewChartsProps): React.JSX.Element {
    const percentage = finishedPeisPercentage(support);
    const metrics = [
        { label: 'Finalizados', value: support.totalPeisFinished.toLocaleString('pt-BR') },
        {
            label: 'Não finalizados',
            value: support.totalPeisNotFinished.toLocaleString('pt-BR'),
        },
        { label: 'Total', value: support.totalPeis.toLocaleString('pt-BR') },
    ];

    return (
        <>
            <div className="gnaiDashboard__charts">
                <RevenueSummaryCard
                    title="Status dos PEIs"
                    caption={
                        support.totalPeis
                            ? 'Percentual de PEIs finalizados'
                            : 'Nenhum PEI cadastrado'
                    }
                    progress={percentage}
                    amount={`${percentage}%`}
                    metrics={metrics}
                    tourTarget={OVERVIEW_TOUR_TARGETS.peis}
                />
                <DistributionChart
                    title="Pendências por prioridade"
                    items={support.pendenciesByPriority}
                    variant="rotated"
                    tourTarget={OVERVIEW_TOUR_TARGETS.pendencies}
                />
            </div>
            <div className="gnaiDashboard__charts">
                <DistributionChart
                    title="Agendamentos por status"
                    items={support.sessionsByStatus}
                    variant="donut"
                    tourTarget={OVERVIEW_TOUR_TARGETS.sessionsByStatus}
                />
                <SessionsTimelineChart months={support.sessionsByMonth} />
            </div>
        </>
    );
}
