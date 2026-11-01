/** Cores do tema por tom de status (marcadores do mapa de barreiras). */
export const STATUS_TONE_COLORS: Record<string, string> = {
    primary: '#5d9cec',
    secondary: '#98a6ad',
    info: '#34d3eb',
    success: '#81c868',
    warning: '#ffbd4a',
    danger: '#f05050',
    purple: '#7266ba',
};

/** Paleta dos gráficos de rosca, na ordem dos exemplos Morris/C3 do Ubold. */
export const DONUT_PALETTE = ['#5fbeaa', '#5d9cec', '#ebeff2', '#7266ba', '#fb6d9d'];

/** Variação da paleta usada pelo gráfico C3 de agendamentos. */
export const C3_DONUT_PALETTE = ['#5fbeaa', '#5d9cec', '#f4f8fb', '#7266ba', '#fb6d9d'];

/** Cor das barras do gráfico C3 rotacionado. */
export const BAR_CHART_COLOR = '#5fbeaa';

export const ACTIVITY_PERIOD_OPTIONS = [
    { value: 'today', label: 'Hoje' },
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
];

export const EMPTY_CHART_TEXT = 'Nenhum registro para exibir.';
