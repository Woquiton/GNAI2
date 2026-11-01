import CardBox from '@/components/UI/CardBox/CardBox';
import MorrisChart from '@/components/UI/MorrisChart/MorrisChart';
import '@/components/UI/SalesAnalyticsCard/SalesAnalyticsCard.css';
import { DONUT_PALETTE, EMPTY_CHART_TEXT } from './Overview.constants';
import type { Metric } from './Overview.types';
import './Overview.css';

interface MetricsChartProps {
    title: string;
    items: Metric[];
    total?: number;
}

export default function MetricsChart({
    title,
    items,
    total,
}: MetricsChartProps): React.JSX.Element {
    const hasData = items.some((item) => item.count > 0);

    return (
        <CardBox className="salesAnalyticsCard">
            <h2 className="salesAnalyticsCard__title text-dark header-title">{title}</h2>
            <ul
                className="salesAnalyticsCard__legend list-inline chart-detail-list"
                aria-label={title}
            >
                {items.map((item, index) => (
                    <li className="salesAnalyticsCard__legendItem" key={item.label}>
                        <h5 className="salesAnalyticsCard__legendLabel">
                            <i
                                className="fa fa-circle salesAnalyticsCard__legendIcon"
                                style={{ color: DONUT_PALETTE[index % DONUT_PALETTE.length] }}
                            />
                            {item.label}: {item.count.toLocaleString('pt-BR')}
                        </h5>
                    </li>
                ))}
            </ul>
            {hasData ? (
                <MorrisChart
                    type="donut"
                    height={303}
                    label={title}
                    options={{
                        data: items.map((item) => ({ label: item.label, value: item.count })),
                        colors: DONUT_PALETTE,
                        resize: true,
                    }}
                />
            ) : (
                <p className="gnaiDashboard__empty">{EMPTY_CHART_TEXT}</p>
            )}
            {total !== undefined && (
                <p className="gnaiDashboard__total">
                    Total geral <strong>{total.toLocaleString('pt-BR')}</strong>
                </p>
            )}
        </CardBox>
    );
}
