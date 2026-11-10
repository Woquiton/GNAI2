import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { BarrierCategoryFilters } from './BarrierCategories.types';

export const emptyBarrierCategoryFilters: BarrierCategoryFilters = {
    created_from: '',
    created_to: '',
    name: '',
    is_active: '',
};

export const barrierCategoryStatusOptions = booleanOptions('Ativo', 'Inativo');
