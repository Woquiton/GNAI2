import type { TeacherFilters } from './Teachers.types';

export const emptyTeacherFilters: TeacherFilters = {
    name: '',
    email: '',
    registration: '',
};

export const NOT_INFORMED = 'Não informado';

// Valores aceitos por CreateTeacherData/UpdateTeacherData (in:male,female,other,not_specified),
// com os mesmos rótulos e ordem do formulário Blade de professores.
export const teacherGenderOptions = [
    { value: 'not_specified', label: 'Não informado' },
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Feminino' },
    { value: 'other', label: 'Outro' },
];
