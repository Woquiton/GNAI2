import type { StudentCourseFilters } from './StudentCourses.types';

/** Aba do prontuário do aluno para onde voltam os fluxos de matrícula. */
export const STUDENT_COURSE_RECORD_TAB = 'academic-data';

export const UNKNOWN_COURSE = 'Curso não identificado';

export const emptyStudentCourseFilters: StudentCourseFilters = {
    created_from: '',
    created_to: '',
    course_id: '',
    academic_year: '',
    is_current: '',
};

export const studentCourseStatusOptions = [
    { value: '1', label: 'Curso Atual' },
    { value: '0', label: 'Histórico' },
];

/** Disciplinas do curso em ordem alfabética, como no formulário e na visualização legados. */
export function sortDisciplines<T extends { name: string }>(disciplines: readonly T[] = []): T[] {
    return [...disciplines].sort((first, second) => first.name.localeCompare(second.name, 'pt-BR'));
}
