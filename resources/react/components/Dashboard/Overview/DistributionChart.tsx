import CardBox from '@/components/UI/CardBox/CardBox';
import C3Chart from '@/components/UI/C3Chart/C3Chart';
import '@/components/UI/SalesAnalyticsCard/SalesAnalyticsCard.css';
import { BAR_CHART_COLOR, C3_DONUT_PALETTE, EMPTY_CHART_TEXT } from './Overview.constants';
import type { Metric } from './Overview.types';
import './Overview.css';

interface DistributionChartProps {
    title: string;
    items: Metric[];
    variant: 'rotated' | 'donut';
}

/** Modelos dos exemplos C3 do Ubold: gráfico rotacionado e rosca. */
export default function DistributionChart({
    title,
    items,
    variant,
}: DistributionChartProps): React.JSX.Element {
    const total = items.reduce((sum, item) => sum + item.count, 0);
    const options =
        variant === 'rotated'
            ? {
                  data: {
                      columns: [['Quantidade', ...items.map((item) => item.count)]],
                      type: 'bar',
                      colors: { Quantidade: BAR_CHART_COLOR },
                  },
                  axis: {
                      rotated: true,
                      x: { type: 'category', categories: items.map((item) => item.label) },
                      y: {
                          min: 0,
                          padding: { bottom: 0 },
                          tick: {
                              format: (value: number) =>
                                  Number.isInteger(value) ? String(value) : '',
                          },
                      },
                  },
              }
            : {
                  data: { columns: items.map((item) => [item.label, item.count]), type: 'donut' },
                  donut: {
                      title: `${total.toLocaleString('pt-BR')} agendamentos`,
                      width: 15,
                      label: { show: false },
                  },
                  color: { pattern: C3_DONUT_PALETTE },
              };
    return (
        <CardBox className="salesAnalyticsCard">
            <h2 className="salesAnalyticsCard__title text-dark header-title">{title}</h2>
            {total > 0 ? (
                <C3Chart
                    label={`${title}: ${items.map((item) => `${item.label}: ${item.count}`).join('; ')}`}
                    options={{ ...options, size: { height: 303 } }}
                />
            ) : (
                <p className="gnaiDashboard__empty">{EMPTY_CHART_TEXT}</p>
            )}
        </CardBox>
    );
}
