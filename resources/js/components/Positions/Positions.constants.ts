import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { PositionFilters } from './Positions.types';

export const emptyPositionFilters: PositionFilters = {
    name: '',
    description: '',
    is_active: '',
};

export const positionStatusOptions = booleanOptions('Ativo', 'Inativo');
