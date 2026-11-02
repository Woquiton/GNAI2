import type { InertiaFormProps } from '@inertiajs/react';

/** Avaliação individual como é editada no formulário. */
export interface AeeEvaluationFormData {
    student_id: number;
    is_present: boolean;
    with_guardians: boolean;
    guardian_ids: number[];
    absence_reason: string;
    student_participation: string;
    adaptations_made: string;
    development_evaluation: string;
    progress_indicators: string;
    recommendations: string;
    next_session_adjustments: string;
}

export type AeeEvaluationTextField = Exclude<
    keyof AeeEvaluationFormData,
    'student_id' | 'is_present' | 'with_guardians' | 'guardian_ids'
>;

export type AeeEvaluationGuardianChanges = Pick<
    AeeEvaluationFormData,
    'with_guardians' | 'guardian_ids'
>;

/** Payload do registro do atendimento (`CreateAeeRecordData`/`UpdateAeeRecordData`). */
export interface AeeRecordFormData {
    attendance_session_id: number;
    duration: string;
    activities_performed: string;
    strategies_used: string;
    resources_used: string;
    general_observations: string;
    evaluations: AeeEvaluationFormData[];
}

export type AeeRecordGeneralField = Exclude<
    keyof AeeRecordFormData,
    'attendance_session_id' | 'evaluations'
>;

/** Estado compartilhado pelas seções do formulário do registro. */
export interface AeeRecordFormSectionProps {
    form: InertiaFormProps<AeeRecordFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
}

/** Avaliação editada pelo prontuário (`UpdateAeeStudentEvaluationData`). */
export type AeeStudentEvaluationFormData = AeeEvaluationFormData & {
    evaluation_id: number;
};

/** Aba de um aluno no formulário do registro. */
export interface AeeEvaluationTab {
    key: string;
    studentId: number;
    name: string;
}
