import CardBox from '@/components/UI/CardBox/CardBox';
import C3Chart from '@/components/UI/C3Chart/C3Chart';
import '@styles/components/UI/SalesAnalyticsCard/SalesAnalyticsCard.css';
import {
    BAR_CHART_COLOR,
    C3_DONUT_PALETTE,
    EMPTY_CHART_TEXT,
    toneColor,
} from './Overview.constants';
import type { Metric } from './Overview.types';
import '@styles/components/Dashboard/Overview/Overview.css';

interface DistributionChartProps {
    /** Valor de `data-tour`, para o tutorial ao vivo destacar o gráfico. */
    tourTarget?: string;
    title: string;
    items: Metric[];
    variant: 'rotated' | 'donut';
}

/** Modelos dos exemplos C3 do Ubold: gráfico rotacionado e rosca. */
export default function DistributionChart({
    title,
    items,
    variant,
    tourTarget,
}: DistributionChartProps): React.JSX.Element {
    const total = items.reduce((sum, item) => sum + item.count, 0);
    // Cada barra na cor do seu item, como a prioridade nas etiquetas das pendências.
    const barColors = items.map((item) => toneColor(item.color, BAR_CHART_COLOR));
    const options =
        variant === 'rotated'
            ? {
                  data: {
                      columns: [['Quantidade', ...items.map((item) => item.count)]],
                      type: 'bar',
                      color: (color: string, point: { index?: number } | string) =>
                          typeof point === 'object' && point.index !== undefined
                              ? (barColors[point.index] ?? color)
                              : color,
                  },
                  // Série única: as categorias no eixo já identificam as barras.
                  legend: { show: false },
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
                  // Com o tom de cada status (como nos agendamentos), as fatias seguem as cores do sistema.
                  color: {
                      pattern: items.map((item, index) =>
                          item.color
                              ? toneColor(item.color, C3_DONUT_PALETTE[index])
                              : C3_DONUT_PALETTE[index % C3_DONUT_PALETTE.length],
                      ),
                  },
              };
    return (
        <CardBox className="salesAnalyticsCard" tourTarget={tourTarget}>
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
