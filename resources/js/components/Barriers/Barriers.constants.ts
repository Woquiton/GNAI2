import type { FieldOption } from '@/components/Forms/FormFields/FormFields.types';
import type { TableLabelTone } from '@/components/UI/TableLabel/TableLabel';
import type { BarrierFilters } from './Barriers.types';

export const emptyBarrierFilters: BarrierFilters = {
    institution_name: '',
    location_name: '',
    is_active: '',

    created_from: '',
    created_to: '',
    name: '',
    category: '',
    priority: '',
    status: '',
};

/** Prioridades (`Priority`) usadas no filtro e nos rótulos da listagem e da visualização. */
export const barrierPriorityOptions: FieldOption[] = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' },
];

/** Situações (`BarrierStatus`) registradas pela vistoria mais recente. */
export const barrierStatusOptions: FieldOption[] = [
    { value: 'identified', label: 'Identificada' },
    { value: 'under_analysis', label: 'Em Análise' },
    { value: 'in_progress', label: 'Em Tratamento' },
    { value: 'resolved', label: 'Resolvida' },
    { value: 'not_applicable', label: 'Não Aplicável' },
];

export const barrierPriorityLabels: Record<string, string> = Object.fromEntries(
    barrierPriorityOptions.map(({ value, label }) => [value, label]),
);

export const barrierStatusLabels: Record<string, string> = Object.fromEntries(
    barrierStatusOptions.map(({ value, label }) => [value, label]),
);

export const inspectionTypeLabels: Record<string, string> = {
    initial: 'Vistoria Inicial',
    periodic: 'Vistoria Periódica',
    return: 'Retorno de Empréstimo',
    maintenance: 'Manutenção',
};

/** Zoom do mapa quando a instituição não informa `default_zoom`. */
export const DEFAULT_BARRIER_ZOOM = 16;

export function barrierPriorityTone(priority: string): TableLabelTone {
    switch (priority) {
        case 'urgent':
        case 'high':
            return 'danger';
        case 'low':
            return 'info';
        default:
            return 'warning';
    }
}

/** Tom do status na listagem. */
export function barrierStatusTone(status: string): TableLabelTone {
    switch (status) {
        case 'resolved':
            return 'success';
        case 'in_progress':
            return 'warning';
        case 'not_applicable':
            return 'danger';
        default:
            return 'inverse';
    }
}

/** Tom do status nos detalhes de uma vistoria. */
export function inspectionStatusTone(status: string | null): TableLabelTone {
    switch (status) {
        case 'resolved':
            return 'success';
        case 'in_progress':
            return 'warning';
        default:
            return 'inverse';
    }
}
