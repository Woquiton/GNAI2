import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { TagFilters } from './Tags.types';

export const emptyTagFilters: TagFilters = {
    name: '',
    is_active: '',
    module: '',
};

export const tagStatusOptions = booleanOptions('Ativo', 'Inativo');
