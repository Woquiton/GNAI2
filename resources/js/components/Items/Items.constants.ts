import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { TableLabelTone } from '@/components/UI/TableLabel/TableLabel';
import type { ItemFilters, ItemType } from './Items.types';

export const itemTypeLabels: Record<ItemType, string> = {
    assistive_technology: 'Tecnologia Assistiva',
    accessible_educational_material: 'Material Pedagógico Acessível',
};

export const emptyItemFilters: ItemFilters = {
    name: '',
    item_type: '',
    is_digital: '',
    accessibility_feature_id: '',
    is_active: '',
    available: '',
    per_page: '',
};

export const itemFilterOptions = {
    nature: booleanOptions('Digital', 'Físico'),
    status: booleanOptions('Ativo', 'Inativo'),
    availability: booleanOptions('Disponível', 'Indisponível'),
};

/** Natureza no formulário: o backend recebe `'0'`/`'1'` em `is_digital`. */
export const itemNatureOptions = [
    { value: '0', label: 'Recurso Físico' },
    { value: '1', label: 'Recurso Digital' },
];

/** Tom do status do recurso na visualização. */
export function resourceStatusTone(status: string | null): TableLabelTone {
    switch (status) {
        case 'available':
            return 'success';
        case 'damaged':
            return 'danger';
        case 'under_maintenance':
            return 'warning';
        default:
            return 'inverse';
    }
}
