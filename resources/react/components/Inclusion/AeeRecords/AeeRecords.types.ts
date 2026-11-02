import type { TableListPage } from '@/components/Tables/TableList/TableList';

export interface AeePerson {
    id?: number;
    name: string;
}

export interface AeeStudent {
    id: number;
    person?: AeePerson | null;
}

export interface AeeProfessional {
    id: number;
    person?: AeePerson | null;
}

export interface AeeSession {
    id: number;
    session_date?: string | null;
    session_objective?: string | null;
    students?: AeeStudent[];
    professional?: AeeProfessional | null;
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

/**
 * Registro do atendimento. Nas visualizações (e no contexto da edição pelo prontuário), os textos
 * ricos chegam como HTML sanitizado pelo `AeeRecordPagePresenter`, com `null` quando vazios; nos
 * formulários, chegam crus para o editor.
 */
export interface AeeRecordRecord {
    id: number;
    attendance_session_id: number;
    duration: string;
    activities_performed: string | null;
    strategies_used: string | null;
    resources_used: string | null;
    general_observations: string | null;
    student_evaluations?: AeeStudentEvaluationRecord[];
    attendance_session?: AeeSession | null;
}

/** Avaliação individual carregada com o registro completo (telas do aluno). */
export type AeeStudentEvaluationWithRecord = AeeStudentEvaluationRecord & {
    aee_record: AeeRecordRecord;
};

/* Listagens */

/** Alias (não interface) para servir aos hooks de filtros, que exigem `Record<string, string>`. */
export type AeeRecordFilters = {
    student: string;
    professional_id: string;
    course_id: string;
    is_present: string;
};

export type AeeRecordFilterName = keyof AeeRecordFilters;

export interface AeeRecordFilterOptions {
    students: AeeStudent[];
    professionals: AeeProfessional[];
    courses: { id: number; name: string }[];
}

export interface AeeListStudent extends AeeStudent {
    current_course?: {
        course?: { id: number; name: string } | null;
    } | null;
}

export interface AeeListEvaluation extends Pick<AeeStudentEvaluationRecord, 'id' | 'is_present'> {
    student?: AeeListStudent | null;
}

/** Linha das listagens gerais (`AeeRecordController@index` e `@myRecords`). */
export interface AeeListRecord extends Pick<AeeRecordRecord, 'id' | 'duration'> {
    attendance_session?: AeeSession | null;
    student_evaluations?: AeeListEvaluation[];
}

export interface AeeRecordPaginator extends TableListPage {
    data: AeeListRecord[];
}

export interface AeeRecordListProps extends AeeRecordFilterOptions {
    aeeRecords: AeeRecordPaginator;
    filters: Partial<AeeRecordFilters>;
    can: {
        view: boolean;
        view_all: boolean;
        view_own: boolean;
    };
}

/** Linha da listagem do aluno (`AeeRecordController@studentIndex`). */
export interface AeeStudentEvaluationListItem extends Pick<
    AeeStudentEvaluationRecord,
    'id' | 'is_present'
> {
    can_manage: boolean;
    aee_record?: {
        id: number;
        duration: string | null;
        attendance_session?: AeeSession | null;
    } | null;
}

export interface AeeStudentEvaluationPaginator extends TableListPage {
    data: AeeStudentEvaluationListItem[];
}

export interface AeeStudentEvaluationListPermissions {
    view: boolean;
    update: boolean;
    delete: boolean;
    view_all: boolean;
}

export type StudentAeeRecordIndexProps = AeeRecordFilterOptions & {
    student: AeeStudent;
    aeeEvaluations: AeeStudentEvaluationPaginator;
    filters: Partial<AeeRecordFilters>;
    can: AeeStudentEvaluationListPermissions;
};

/* Formulários e visualizações */

export interface AeeRecordCreateProps {
    session: AeeSession;
    guardiansByStudent: AeeGuardiansByStudent;
}

export interface AeeRecordEditProps extends AeeRecordCreateProps {
    aeeRecord: AeeRecordRecord;
}

/** Permissões de autoria das visualizações (`AeeRecordPagePresenter::managementAbilities`). */
export interface AeeRecordManagementPermissions {
    update: boolean;
    delete: boolean;
}

export interface AeeRecordShowProps {
    aeeRecord: AeeRecordRecord;
    session: AeeSession;
    can: AeeRecordManagementPermissions;
}

export interface StudentAeeRecordShowProps {
    student: { id: number };
    evaluation: AeeStudentEvaluationWithRecord;
    can: AeeRecordManagementPermissions;
}

export interface StudentAeeRecordEditProps {
    student: { id: number };
    evaluation: AeeStudentEvaluationWithRecord;
    guardians: AeeGuardianOption[];
}
