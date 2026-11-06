import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { SemesterFilters, SemesterRecord } from './Semesters.types';

export const emptySemesterFilters: SemesterFilters = {
    year: '',
    term: '',
    label: '',
    is_current: '',
};

export const semesterFilterOptions = {
    term: [
        { value: '1', label: '1º semestre' },
        { value: '2', label: '2º semestre' },
    ],
    current: booleanOptions('Atual', 'Não atual'),
};

/** Nome exibido do semestre: o rótulo informado ou `ano.período`. */
export function semesterLabel(semester: Pick<SemesterRecord, 'label' | 'year' | 'term'>): string {
    return semester.label || `${semester.year}.${semester.term}`;
}
