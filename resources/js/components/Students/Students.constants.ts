import type { TableLabelTone } from '@/components/UI/TableLabel/TableLabel';
import type { StudentFilters } from './Students.types';

export const STUDENT_FAILURE_TEXT =
    'Não foi possível concluir a operação. Atualize a página e tente novamente.';

export const emptyStudentFilters: StudentFilters = {
    name: '',
    phone: '',
    email: '',
    status: '',
    follow_up_type: '',
    course_id: '',
    deficiency_id: '',
    registration: '',
    per_page: '',
};

/** Opções "sem vínculo" dos filtros de curso e perfil (o backend recebe `0`). */
export const studentWithoutCourseOption = { value: '0', label: 'Sem curso' };
export const studentWithoutProfileOption = { value: '0', label: 'Sem perfil de atendimento' };

/** Tons dos status dos Estudos de Caso e PAEEs exibidos no prontuário. */
export const caseStudyStatusTones: Record<string, TableLabelTone> = {
    completed: 'success',
    in_progress: 'warning',
};

export const paeeStatusTones: Record<string, TableLabelTone> = {
    active: 'success',
    under_review: 'warning',
};

/** Descrição curta de cada etapa do status do atendimento, pela chave enviada pelo backend. */
export const studentStatusStepDescriptions: Record<string, string> = {
    'current-course': 'Vinculação do aluno ao curso.',
    'technical-report': 'Inserção do laudo médico.',
    'case-study': 'Elaboração do estudo de caso.',
    paee: 'Plano de Atendimento Educacional Especializado.',
    pei: 'Plano Educacional Individualizado.',
};
