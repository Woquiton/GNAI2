import type { TeacherDisciplineField } from './Form/TeacherDisciplineForm.types';

/** Campos na ordem da tela do professor; o prazo é um texto curto e os textos do Blade usam o editor rico. */
export const TEACHER_DISCIPLINE_FIELDS: TeacherDisciplineField[] = [
    { name: 'specific_objectives', label: 'Objetivos Específicos', required: true, rich: true },
    {
        name: 'objectives_deadline',
        label: 'Prazo das metas/objetivos',
        hint: 'Opcional.',
        placeholder: 'Ex.: até o fim do bimestre',
        input: true,
    },
    { name: 'content_programmatic', label: 'Conteúdo Programático', required: true, rich: true },
    {
        name: 'curricular_reference',
        label: 'Referência curricular (BNCC ou ementa/unidade)',
        hint: 'Opcional. No superior, use a ementa ou unidade curricular.',
        rows: 2,
    },
    { name: 'methodologies', label: 'Metodologias e Estratégias', required: true, rich: true },
    {
        name: 'materials_and_assistive_technology',
        label: 'Recursos didáticos e tecnologia assistiva',
        hint: 'Opcional. Preencha quando indicado para esta disciplina.',
        rows: 2,
    },
    { name: 'evaluations', label: 'Processo de Avaliação', required: true, rich: true },
    { name: 'opinion', label: 'Parecer', rich: true },
    { name: 'complementary_records', label: 'Registros Complementares', rich: true },
];

export const TEACHER_DISCIPLINE_FAILURE_TEXT =
    'Não foi possível salvar a adaptação. Tente novamente.';

export const emptyTeacherAssignmentFilters = {
    student: '',
    discipline: '',
    course: '',
};
