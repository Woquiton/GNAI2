import { useCallback } from 'react';
import { chartWindow } from '@/utils/chartRuntime';
import type { ChartMount } from '@/hooks/useChart.types';
import { useChart } from '@/hooks/useChart';
import '@styles/components/UI/C3Chart/C3Chart.css';
const scripts = ['/assets/plugins/d3/d3.min.js', '/assets/plugins/c3/c3.min.js'];
export default function C3Chart({
    options,
    label,
}: {
    options: Record<string, unknown>;
    label?: string;
}): React.JSX.Element {
    const mount = useCallback<ChartMount>(
        (element) => {
            // C3 mede getBoundingClientRect por padrão, que já inclui o zoom do documento.
            // A biblioteca precisa da largura local para não aplicar a ampliação duas vezes.
            const size = options.size as Record<string, unknown> | undefined;
            const chart = chartWindow.c3.generate({
                ...options,
                size: { ...size, width: element.clientWidth },
                bindto: element,
            });
            return {
                resize: () => chart.resize({ width: element.clientWidth }),
                destroy: () => chart.destroy(),
            };
        },
        [options],
    );
    const ref = useChart(scripts, mount);
    return <div ref={ref} role={label ? 'group' : undefined} aria-label={label} />;
}
