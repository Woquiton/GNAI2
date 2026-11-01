import { Link } from '@inertiajs/react';
import StatWidgetCard from '@/components/UI/StatWidgetCard/StatWidgetCard';
import { joinClassNames } from '@/utils/joinClassNames';
import type { OverviewStat } from './Overview.types';
import './Overview.css';

interface OverviewStatGridProps {
    stats: OverviewStat[];
    /** Grade do radar, com quatro colunas em telas muito largas. */
    radar?: boolean;
}

/** Indicadores do painel; cada card é um link para a listagem filtrada correspondente. */
export default function OverviewStatGrid({
    stats,
    radar = false,
}: OverviewStatGridProps): React.JSX.Element {
    return (
        <div
            className={joinClassNames(
                'gnaiDashboard__stats',
                radar && 'gnaiDashboard__stats--radar',
            )}
        >
            {stats.map((item) => (
                <Link
                    key={item.title}
                    href={item.href}
                    aria-label={`${item.title}: ${item.value}`}
                >
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
}
