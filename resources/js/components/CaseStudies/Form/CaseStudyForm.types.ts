import type { InertiaFormProps } from '@inertiajs/react';
import type { CaseStudyBarrierInput, CaseStudyStrategyInput } from '../CaseStudies.types';

/** Payload enviado a `CaseStudyController@store/update` (ver `Application/Data/CaseStudies`). */
export type CaseStudyFormData = {
    demand_origin: string;
    participants_summary: string;
    study_date: string;
    student_observation: string;
    student_family_listening: string;
    teachers_listening: string;
    other_info: string;
    care_network_notes: string;
    favorable_aspects: string;
    potentials_interests: string;
    needed_supports: string[];
    needed_supports_justification: string;
    acceptance_status: string;
    acceptance_date: string;
    barriers: CaseStudyBarrierInput[];
    strategies: CaseStudyStrategyInput[];
};

/** Campos de texto do payload; os editores ricos usam apenas estes. */
export type CaseStudyTextField = {
    [Key in keyof CaseStudyFormData]: CaseStudyFormData[Key] extends string ? Key : never;
}[keyof CaseStudyFormData];

/** Estado compartilhado pelas seções do formulário. */
export interface CaseStudyFormSectionProps {
    form: InertiaFormProps<CaseStudyFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
}

/** Seções com editores ricos, que bloqueiam o envio quando o editor não carrega. */
export interface CaseStudyRichTextSectionProps extends CaseStudyFormSectionProps {
    onEditorFailure: (field: CaseStudyTextField) => void;
}
