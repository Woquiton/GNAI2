import type { TableLabelTone } from '@/components/UI/TableLabel/TableLabel';
import type { PendencyListFilters } from './Pendencies.types';

/** Filtros de "Minhas Pendências" usam o mesmo formato, sem o campo de profissional. */
export const emptyPendencyFilters: PendencyListFilters = {
    title: '',
    assigned_to: '',
    priority: '',
    is_completed: '',
};

export const pendencyStatusOptions = [
    { value: '0', label: 'Pendentes' },
    { value: '1', label: 'Concluídas' },
];

const priorityTones: Record<string, TableLabelTone> = {
    info: 'info',
    warning: 'warning',
    danger: 'danger',
    dark: 'inverse',
};

/** Tom da etiqueta de prioridade a partir da cor enviada pelo backend. */
export function priorityTone(color: string | null | undefined): TableLabelTone {
    return priorityTones[color ?? ''] ?? 'inverse';
}
