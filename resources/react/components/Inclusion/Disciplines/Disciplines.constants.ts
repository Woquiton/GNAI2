import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { DisciplineFilters } from './Disciplines.types';

export const emptyDisciplineFilters: DisciplineFilters = { name: '', is_active: '' };

/** Status no filtro e no formulário: o backend recebe `'1'`/`'0'` em `is_active`. */
export const disciplineStatusOptions = booleanOptions('Ativo', 'Inativo');
