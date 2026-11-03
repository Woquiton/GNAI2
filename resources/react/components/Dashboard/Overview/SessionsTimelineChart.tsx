import { useMemo } from 'react';
import CardBox from '@/components/UI/CardBox/CardBox';
import MorrisChart from '@/components/UI/MorrisChart/MorrisChart';
import '@/components/UI/SalesAnalyticsCard/SalesAnalyticsCard.css';
import { EMPTY_CHART_TEXT, STATUS_TONE_COLORS } from './Overview.constants';
import type { SessionMonth } from './Overview.types';
import { OVERVIEW_TOUR_TARGETS } from './overviewTour';
import './Overview.css';

/* Empilhadas de baixo para cima nas cores dos status; nesta ordem verde e amarelo não se tocam. */
const SERIES = [
    { key: 'completed', label: 'Realizadas', color: STATUS_TONE_COLORS.success },
    { key: 'cancelled', label: 'Canceladas', color: STATUS_TONE_COLORS.danger },
    { key: 'scheduled', label: 'Agendadas', color: STATUS_TONE_COLORS.warning },
] as const;

const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

/** "2026-06" → "jun/26", no fuso local para não voltar um mês. */
function monthLabel(month: string): string {
    const [year, monthNumber] = month.split('-').map(Number);
    const name = monthName.format(new Date(year, monthNumber - 1, 1)).replace('.', '');

    return `${name}/${String(year).slice(-2)}`;
}

/** Modelo "Area chart with point" do Morris no Ubold: agendamentos dos últimos seis meses. */
export default function SessionsTimelineChart({
    months,
}: {
    months: SessionMonth[];
}): React.JSX.Element {
    const title = 'Agendamentos nos últimos 6 meses';
    const hasData = months.some((month) => SERIES.some(({ key }) => month[key] > 0));
    const options = useMemo(
        () => ({
            data: months.map((month) => ({
                month: monthLabel(month.month),
                completed: month.completed,
                cancelled: month.cancelled,
                scheduled: month.scheduled,
            })),
            xkey: 'month',
            ykeys: SERIES.map(({ key }) => key),
            labels: SERIES.map(({ label }) => label),
            lineColors: SERIES.map(({ color }) => color),
            parseTime: false,
            pointSize: 3,
            lineWidth: 1,
            pointFillColors: ['#ffffff'],
            pointStrokeColors: ['#999999'],
            hideHover: 'auto',
            gridLineColor: '#eef0f2',
            resize: true,
        }),
        [months],
    );
    const summary = months
        .map(
            (month) =>
                `${monthLabel(month.month)}: ${SERIES.map(
                    ({ key, label }) => `${month[key]} ${label.toLowerCase()}`,
                ).join(', ')}`,
        )
        .join('; ');

    return (
        <CardBox className="salesAnalyticsCard" tourTarget={OVERVIEW_TOUR_TARGETS.sessionsByMonth}>
            <h2 className="salesAnalyticsCard__title text-dark header-title">{title}</h2>
            <ul className="salesAnalyticsCard__legend list-inline chart-detail-list">
                {SERIES.map(({ key, label, color }) => (
                    <li className="salesAnalyticsCard__legendItem" key={key}>
                        <h5 className="salesAnalyticsCard__legendLabel">
                            <i
                                className="fa fa-circle salesAnalyticsCard__legendIcon"
                                style={{ color }}
                                aria-hidden="true"
                            />
                            {label}
                        </h5>
                    </li>
                ))}
            </ul>
            {hasData ? (
                <MorrisChart
                    type="area"
                    height={303}
                    label={`${title}. ${summary}`}
                    options={options}
                />
            ) : (
                <p className="gnaiDashboard__empty">{EMPTY_CHART_TEXT}</p>
            )}
        </CardBox>
    );
}
