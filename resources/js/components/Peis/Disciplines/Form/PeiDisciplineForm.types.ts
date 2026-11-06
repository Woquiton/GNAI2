/** Payload do PUT `pei-discipline.update`. */
export type PeiDisciplineFormData = {
    teacher_id: string;
    discipline_id: string;
    specific_objectives: string;
    objectives_deadline: string;
    content_programmatic: string;
    curricular_reference: string;
    methodologies: string;
    materials_and_assistive_technology: string;
    evaluations: string;
    complementary_records: string;
    opinion: string;
};

export type PeiDisciplineTextField = Exclude<
    keyof PeiDisciplineFormData,
    'teacher_id' | 'discipline_id'
>;

export interface PeiDisciplineTextFieldConfig {
    name: PeiDisciplineTextField;
    label: string;
    required: boolean;
    hint?: string;
    /** Campo curto em uma linha (`TextInput`) no lugar da área de texto. */
    singleLine?: boolean;
    /** Texto formatado no editor rico (Summernote), como no Blade. */
    rich?: boolean;
    /** `false` coloca o campo em meia linha, ao lado do seguinte, como no Blade. */
    wide?: boolean;
}
