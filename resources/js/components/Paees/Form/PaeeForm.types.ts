import type { InertiaFormProps } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import type { RichTextFieldProps } from '@/components/Forms/FormFields/RichTextField';
import type ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import type { PaeeEditRecord, PaeeFormOptions } from '../Paees.types';

export interface PaeeObjectiveInput {
    description: string;
    term: string;
    linked_barrier_id: number | null;
}

export interface PaeeResourceInput {
    description: string;
    acquisition_type: string;
    assistive_technology_id: number | null;
}

/** Campos enviados no cadastro e na edição (mesmos nomes do Blade de origem). */
export interface PaeeFormData {
    attendance_frequency_per_week: string;
    attendance_duration_minutes: string;
    attendance_format: string;
    attendance_location: string;
    assistive_technology_needed: boolean;
    assistive_technology_notes: string;
    assistive_technology_availability_capacity: string;
    caa_needed: boolean;
    caa_notes: string;
    is_assistive_technology_portable_digital_device: boolean;
    assistive_technology_pedagogical_opinion: string;
    support_professional_needed: boolean;
    support_professional_justification: string;
    libras_interpreter_needed: boolean;
    libras_interpreter_justification: string;
    guide_interpreter_needed: boolean;
    guide_interpreter_justification: string;
    school_professionals_orientation: string;
    common_teachers_articulation: string;
    family_articulation: string;
    intersectoral_articulation: string;
    training_demands: string;
    objectives: PaeeObjectiveInput[];
    resources: PaeeResourceInput[];
}

/** Cadastro a partir do Estudo de Caso (`case_study_id`) ou edição de um PAEE existente. */
export type PaeeFormProps = (
    | { mode: 'create'; caseStudyId: number }
    | { mode: 'edit'; paee: PaeeEditRecord }
) & { options: PaeeFormOptions };

export type PaeeBooleanField =
    | 'assistive_technology_needed'
    | 'caa_needed'
    | 'is_assistive_technology_portable_digital_device'
    | 'support_professional_needed'
    | 'libras_interpreter_needed'
    | 'guide_interpreter_needed';

/** Campos de texto rico (Summernote). */
export type PaeeTextField = Exclude<
    keyof PaeeFormData,
    | PaeeBooleanField
    | 'objectives'
    | 'resources'
    | 'attendance_frequency_per_week'
    | 'attendance_duration_minutes'
    | 'attendance_format'
    | 'attendance_location'
>;

/** Props ligadas ao estado do formulário; a seção informa o label e as regras visuais. */
export type PaeeRichTextControl = Omit<RichTextFieldProps, 'label'>;
export type PaeeToggleControl = Omit<ComponentProps<typeof ToggleControl>, 'label'>;

/** Estado compartilhado pelas seções do formulário. */
export interface PaeeFormSectionProps {
    form: InertiaFormProps<PaeeFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
    options: PaeeFormOptions;
    richText: (name: PaeeTextField) => PaeeRichTextControl;
    toggle: (name: PaeeBooleanField) => PaeeToggleControl;
}
