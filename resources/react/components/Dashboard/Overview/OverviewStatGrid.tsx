import { Link } from '@inertiajs/react';
import StatWidgetCard from '@/components/UI/StatWidgetCard/StatWidgetCard';
import { joinClassNames } from '@/utils/joinClassNames';
import type { OverviewStat } from './Overview.types';
import { OVERVIEW_TOUR_TARGETS } from './overviewTour';
import './Overview.css';

interface OverviewStatGridProps {
    stats: OverviewStat[];
    /** Todos os cards numa linha só quando a área do painel comporta; abaixo disso, três por linha. */
    singleRow?: boolean;
}

/** Indicadores do painel; cada card é um link para a listagem filtrada correspondente. */
export default function OverviewStatGrid({
    stats,
    singleRow = false,
}: OverviewStatGridProps): React.JSX.Element {
    const grid = (
        <div
            className={joinClassNames(
                'gnaiDashboard__stats',
                singleRow && 'gnaiDashboard__stats--singleRow',
            )}
            data-tour={OVERVIEW_TOUR_TARGETS.stats}
        >
            {stats.map((item) => (
                <Link key={item.title} href={item.href} aria-label={`${item.title}: ${item.value}`}>
                    <StatWidgetCard
                        title={item.title}
                        value={String(item.value)}
                        tone={item.tone}
                        iconClass={`fa fa-${item.icon} text-${item.tone}`}
                    />
                </Link>
            ))}
        </div>
    );

    // A largura útil muda com a sidebar recolhida; a consulta mede a área do painel, não a janela.
    return singleRow ? <div className="gnaiDashboard__statsArea">{grid}</div> : grid;
}
