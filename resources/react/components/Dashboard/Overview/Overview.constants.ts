/** Cores do tema por tom de status (marcadores do mapa de barreiras). */
export const STATUS_TONE_COLORS: Record<string, string> = {
    primary: '#3b82f6',
    secondary: '#98a6ad',
    info: '#06b6d4',
    success: '#16a34a',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#7266ba',
    inverse: '#64748b',
};

/** Cor do tom enviado pelo backend (`dark` equivale ao `inverse` das etiquetas); sem tom, a cor padrão. */
export function toneColor(tone: string | undefined, fallback: string): string {
    return STATUS_TONE_COLORS[tone === 'dark' ? 'inverse' : (tone ?? '')] ?? fallback;
}

/** Paleta dos gráficos de rosca, na ordem dos exemplos Morris/C3 do Ubold. */
export const DONUT_PALETTE = ['#14b8a6', '#3b82f6', '#ebeff2', '#7266ba', '#fb6d9d'];

/** Variação da paleta usada pelo gráfico C3 de agendamentos. */
export const C3_DONUT_PALETTE = ['#14b8a6', '#3b82f6', '#f4f8fb', '#7266ba', '#fb6d9d'];

/** Cor das barras do gráfico C3 rotacionado. */
export const BAR_CHART_COLOR = '#14b8a6';

export const ACTIVITY_PERIOD_OPTIONS = [
    { value: 'today', label: 'Hoje' },
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
];

export const EMPTY_CHART_TEXT = 'Nenhum registro para exibir.';
