import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { CourseFilters } from './Courses.types';

export const emptyCourseFilters: CourseFilters = { name: '', is_active: '' };

/** Status no filtro e no formulário de edição: o backend recebe `'1'`/`'0'` em `is_active`. */
export const courseStatusOptions = booleanOptions('Ativo', 'Inativo');
