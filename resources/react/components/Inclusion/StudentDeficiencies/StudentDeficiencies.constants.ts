import type { StudentDeficiencyFilters } from './StudentDeficiencies.types';

/** Aba do prontuário do aluno para onde voltam os fluxos de perfis de atendimento. */
export const STUDENT_DEFICIENCY_RECORD_TAB = 'support-profiles';

export const UNKNOWN_PROFILE = 'Perfil não identificado';

export const emptyStudentDeficiencyFilters: StudentDeficiencyFilters = {
    deficiency_id: '',
    severity: '',
};

/** Valores de `DeficiencySeverity`. */
export const severityOptions = [
    { value: 'mild', label: 'Leve' },
    { value: 'moderate', label: 'Moderada' },
    { value: 'severe', label: 'Severa' },
];
