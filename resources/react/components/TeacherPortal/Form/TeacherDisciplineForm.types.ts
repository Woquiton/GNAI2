/** Payload do `PUT /professor/adaptacoes/{peiDiscipline}`. */
export interface TeacherDisciplineFormData {
    specific_objectives: string;
    objectives_deadline: string;
    content_programmatic: string;
    curricular_reference: string;
    methodologies: string;
    materials_and_assistive_technology: string;
    evaluations: string;
    opinion: string;
    complementary_records: string;
}

export interface TeacherDisciplineField {
    name: keyof TeacherDisciplineFormData;
    label: string;
    required?: boolean;
    hint?: string;
    placeholder?: string;
    rows?: number;
    /** Texto curto em `input`; os demais campos são texto livre em `textarea`. */
    input?: boolean;
    /** Texto formatado no editor rico (Summernote), como no Blade. */
    rich?: boolean;
}
