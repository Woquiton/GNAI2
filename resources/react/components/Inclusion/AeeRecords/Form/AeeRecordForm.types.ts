import type { InertiaFormProps } from '@inertiajs/react';
import type { AttendanceDetailsValues } from '@/components/Inclusion/Sessions/Form/AttendanceDetailsFields';

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

/**
 * Estado do registro do atendimento. O cabeçalho (data, horário, local, alunos e formato) só é
 * enviado no registro direto (`CreateDirectAeeRecordData`) e, em parte, na edição
 * (`UpdateAeeRecordData`); a criação pelo agendamento envia só `attendance_session_id`.
 */
export interface AeeRecordFormData extends AttendanceDetailsValues {
    attendance_session_id: number | null;
    type: string;
    duration: string;
    activities_performed: string;
    strategies_used: string;
    resources_used: string;
    general_observations: string;
    evaluations: AeeEvaluationFormData[];
}

export type AeeRecordGeneralField =
    | 'duration'
    | 'activities_performed'
    | 'strategies_used'
    | 'resources_used'
    | 'general_observations';

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
