import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { AeeRecordFilterName, AeeRecordFilters, AeeStudent } from './AeeRecords.types';

/** Todos os filtros aceitos; cada tela exibe só os que o controller devolve. */
export const emptyAeeRecordFilters: AeeRecordFilters = {
    student: '',
    professional_id: '',
    course_id: '',
    is_present: '',
};

/** Filtros de `AeeRecordController@index`. */
export const AEE_RECORD_INDEX_FILTERS: AeeRecordFilterName[] = [
    'student',
    'professional_id',
    'course_id',
    'is_present',
];

/** Filtros de `AeeRecordController@myRecords`. */
export const MY_AEE_RECORD_FILTERS: AeeRecordFilterName[] = ['student', 'course_id', 'is_present'];

/** Filtros de `AeeRecordController@studentIndex`; o profissional exige `aee-record.view-all`. */
export function studentAeeRecordFilters(canViewAll: boolean): AeeRecordFilterName[] {
    return canViewAll ? ['professional_id', 'is_present'] : ['is_present'];
}

export const aeeRecordFilterLabels: Record<
    AeeRecordFilterName,
    { label: string; placeholder: string }
> = {
    student: { label: 'Estudante', placeholder: 'Estudante (Todos)' },
    professional_id: { label: 'Profissional', placeholder: 'Profissional (Todos)' },
    course_id: { label: 'Curso', placeholder: 'Curso (Todos)' },
    is_present: { label: 'Presença', placeholder: 'Presença (Todas)' },
};

export const aeePresenceFilterOptions = booleanOptions('Presente', 'Ausente');

/** O filtro de curso aceita `0` para alunos sem curso atual. */
export const AEE_WITHOUT_COURSE_OPTION = { value: '0', label: 'Sem curso' };

export const AEE_LIST_FAILURE_TEXT =
    'Não foi possível atualizar os atendimentos especializados. Tente novamente.';

export const STUDENT_AEE_LIST_FAILURE_TEXT =
    'Não foi possível atualizar os registros de atendimento AEE. Tente novamente.';

export const AEE_DELETE_FAILURE_TEXT = 'Não foi possível concluir a exclusão. Tente novamente.';

export const AEE_RECORD_SAVE_FAILURE_TEXT =
    'Não foi possível salvar o registro do atendimento AEE. Tente novamente.';

export const AEE_EVALUATION_SAVE_FAILURE_TEXT =
    'Não foi possível salvar a avaliação do aluno. Tente novamente.';

export function aeeStudentName(student: AeeStudent | null | undefined, studentId: number): string {
    return student?.person?.name ?? `Aluno #${studentId}`;
}

/** Textos de textarea vazios aparecem com o mesmo substituto do legado. */
export function aeeTextValue(value: string | null | undefined, fallback = 'N/A'): string {
    return value?.trim() ? value : fallback;
}
