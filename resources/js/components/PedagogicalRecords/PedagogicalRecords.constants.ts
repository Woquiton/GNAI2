import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type {
    PedagogicalRecordFilterName,
    PedagogicalRecordFilters,
} from './PedagogicalRecords.types';

interface PedagogicalRecordFilterSet {
    primary: PedagogicalRecordFilterName[];
    more: PedagogicalRecordFilterName[];
}

export const emptyPedagogicalRecordFilters: PedagogicalRecordFilters = {
    student: '',
    professional_id: '',
    course_id: '',
    is_present: '',
    with_guardians: '',
};

export const pedagogicalRecordFilterOptions = {
    presence: booleanOptions('Presente', 'Ausente'),
    guardians: booleanOptions('Sim', 'Não'),
    /** Valor `0` filtra os alunos sem curso vinculado. */
    withoutCourse: { value: '0', label: 'Sem curso' },
};

/** Filtros visíveis e complementares de cada listagem. */
export const pedagogicalRecordFilterSets: Record<'all' | 'own', PedagogicalRecordFilterSet> = {
    all: {
        primary: ['student', 'professional_id', 'course_id'],
        more: ['is_present', 'with_guardians'],
    },
    own: {
        primary: ['student', 'course_id', 'is_present', 'with_guardians'],
        more: [],
    },
};

/** No histórico do aluno, o filtro por profissional depende de `pedagogical-record.view-all`. */
export function studentPedagogicalRecordFilters(
    canViewAll: boolean,
): PedagogicalRecordFilterName[] {
    return canViewAll
        ? ['professional_id', 'is_present', 'with_guardians']
        : ['is_present', 'with_guardians'];
}

export const pedagogicalRecordFailureTexts = {
    list: 'Não foi possível atualizar os atendimentos pedagógicos. Tente novamente.',
    delete: 'Não foi possível excluir o atendimento pedagógico. Tente novamente.',
    save: 'Não foi possível salvar o atendimento pedagógico. Tente novamente.',
};
