import type { PeiDisciplineRecord } from '../../Peis.types';
import type {
    PeiDisciplineFormData,
    PeiDisciplineTextFieldConfig,
} from './PeiDisciplineForm.types';

/** Campos do planejamento adaptado, na ordem do Blade. */
export const peiDisciplineTextFields: PeiDisciplineTextFieldConfig[] = [
    {
        name: 'specific_objectives',
        label: 'Objetivos Específicos',
        required: true,
        wide: false,
    },
    {
        name: 'objectives_deadline',
        label: 'Prazo das metas/objetivos',
        required: false,
        singleLine: true,
        wide: false,
        hint: 'Opcional. Ex.: "até o fim do bimestre", "até dezembro/2026".',
    },
    {
        name: 'content_programmatic',
        label: 'Conteúdo Programático',
        required: true,
        wide: false,
    },
    {
        name: 'curricular_reference',
        label: 'Referência curricular (BNCC ou ementa/unidade)',
        required: false,
        wide: false,
        hint: 'Opcional. No superior, use a ementa ou unidade curricular correspondente.',
    },
    {
        name: 'methodologies',
        label: 'Metodologias e Estratégias',
        required: true,
        wide: false,
    },
    {
        name: 'materials_and_assistive_technology',
        label: 'Recursos didáticos e tecnologia assistiva',
        required: false,
        wide: false,
        hint: 'Opcional. Preencha quando a disciplina exigir recurso específico (quando indicado).',
    },
    {
        name: 'evaluations',
        label: 'Processo de Avaliação',
        required: true,
    },
    {
        name: 'complementary_records',
        label: 'Registros Complementares',
        required: false,
        hint: 'Espaço opcional destinado ao registro de informações relevantes que contribuam para o acompanhamento pedagógico do estudante e que não estejam contempladas nos campos anteriores.',
    },
    {
        name: 'opinion',
        label: 'Parecer',
        required: false,
    },
];

/** Valores iniciais da edição a partir da adaptação salva. */
export function peiDisciplineFormData(record: PeiDisciplineRecord): PeiDisciplineFormData {
    return {
        teacher_id: String(record.teacher_id),
        discipline_id: String(record.discipline_id),
        specific_objectives: record.specific_objectives ?? '',
        objectives_deadline: record.objectives_deadline ?? '',
        content_programmatic: record.content_programmatic ?? '',
        curricular_reference: record.curricular_reference ?? '',
        methodologies: record.methodologies ?? '',
        materials_and_assistive_technology: record.materials_and_assistive_technology ?? '',
        evaluations: record.evaluations ?? '',
        complementary_records: record.complementary_records ?? '',
        opinion: record.opinion ?? '',
    };
}
