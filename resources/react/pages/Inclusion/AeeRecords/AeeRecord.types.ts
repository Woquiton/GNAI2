export interface AeePerson {
    id?: number;
    name: string;
}

export interface AeeStudent {
    id: number;
    person?: AeePerson | null;
}

export interface AeeSession {
    id: number;
    session_date?: string | null;
    session_objective?: string | null;
    students?: AeeStudent[];
    professional?: {
        id: number;
        person?: AeePerson | null;
    } | null;
}

export interface AeeGuardianOption {
    id: number;
    name: string;
    relationship_label: string;
}

/** Responsáveis de cada aluno do atendimento, indexados pelo id do aluno. */
export type AeeGuardiansByStudent = Record<number, AeeGuardianOption[]>;

export interface AeeStudentEvaluationRecord {
    id: number;
    aee_record_id: number;
    student_id: number;
    is_present: boolean;
    with_guardians?: boolean;
    guardians?: Array<{ id: number }>;
    absence_reason: string | null;
    student_participation: string | null;
    adaptations_made: string | null;
    development_evaluation: string | null;
    progress_indicators: string | null;
    recommendations: string | null;
    next_session_adjustments: string | null;
    student?: AeeStudent | null;
}

export interface AeeRecordRecord {
    id: number;
    attendance_session_id: number;
    duration: string;
    activities_performed: string;
    strategies_used: string | null;
    resources_used: string | null;
    general_observations: string | null;
    student_evaluations?: AeeStudentEvaluationRecord[];
    attendance_session?: AeeSession | null;
}

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
    "student_id" | "is_present" | "with_guardians" | "guardian_ids"
>;
