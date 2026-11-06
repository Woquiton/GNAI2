import type { SelectFieldOption } from '@/components/Forms/SelectField/SelectField.types';
import type { TableListPage } from '@/components/Tables/TableList/TableList';

export type PeiListVariant = 'all' | 'student';

export interface PeiListOption {
    value: string;
    label: string;
}

/** Linha das listagens de PEIs (`PeiPagePresenter@all` e `@index`). */
export interface PeiListRecord {
    id: number;
    version: number | null;
    is_finished: boolean;
    is_current: boolean;
    created_at: string | null;
    semester?: {
        id: number;
        label: string | null;
    } | null;
    course?: {
        id: number;
        name: string | null;
    } | null;
    student?: {
        id: number;
        registration?: string | null;
        person?: {
            name?: string | null;
        } | null;
    } | null;
}

export interface PeiPaginator extends TableListPage {
    data: PeiListRecord[];
}

export type PeiListFilters = {
    student_id: string;
    semester_id: string;
    version: string;
    is_finished: string;
};

export interface PeiListPermissions {
    create: boolean;
    view: boolean;
    delete: boolean;
}

export interface PeiListProps {
    peis: PeiPaginator;
    semesters: PeiListOption[];
    students?: PeiListOption[];
    filters: Partial<PeiListFilters>;
    can: PeiListPermissions;
}

export interface PeiStudentSummary {
    id: number;
    name: string;
}

export type PeiIndexProps = PeiListProps & { student: PeiStudentSummary };

/** Dados da geração de um novo PEI (`PeiFormQuery@forCreation`). */
export interface PeiCreateProps {
    student: { id: number; person?: { name: string } | null };
    course: { name: string };
    semester: { label: string };
}

/** Visualização do PEI (`PeiPagePresenter@show`). */
export interface PeiShowRecord {
    id: number;
    version: number | null;
    is_finished: boolean;
    created_at: string | null;
    course_name: string | null;
    semester_label: string | null;
    responsible: string;
}

export interface PeiShowStudent {
    id: number;
    name: string;
    registration: string | null;
    photo_url: string | null;
    status_label: string | null;
    status_color: string | null;
    deficiencies: string[];
}

export interface PeiPaeeSummary {
    id: number;
    version: number | null;
    status_label: string;
    attendance_frequency_per_week: number | null;
    attendance_duration_minutes: number | null;
    attendance_format_label: string;
    attendance_location_label: string;
    common_teachers_articulation_html: string;
}

export interface PeiAttendanceActivity {
    id: string;
    date: string | null;
    professional: string | null;
    text_html: string;
}

export interface PeiAttendanceMonitoring {
    id: string;
    date: string | null;
    source: string;
    text_html: string;
    indicators_html: string | null;
    adjustments_html: string | null;
}

export interface PeiAttendanceReturn {
    id: string;
    date: string | null;
    source: string;
    professional: string | null;
    guardians: string | null;
    summary_html: string;
}

export interface PeiAttendanceSummary {
    activities: PeiAttendanceActivity[];
    monitoring: PeiAttendanceMonitoring[];
    returns: PeiAttendanceReturn[];
}

export interface PeiDisciplineSummary {
    id: number;
    discipline_name: string | null;
    teacher_name: string | null;
    created_at: string | null;
    can_update: boolean;
    can_delete: boolean;
}

export interface PeiShowPermissions {
    viewPaee: boolean;
    viewDisciplines: boolean;
    createDiscipline: boolean;
    finish: boolean;
    delete: boolean;
    updateOtherInfo: boolean;
    pdf: boolean;
}

export interface PeiShowProps {
    pei: PeiShowRecord;
    student: PeiShowStudent;
    paee: PeiPaeeSummary | null;
    attendanceSummary: PeiAttendanceSummary;
    otherRelevantInfo: string | null;
    peiDisciplines: PeiDisciplineSummary[] | null;
    activeTab?: string;
    can: PeiShowPermissions;
}

export interface PeiDisciplineDetails {
    id: number;
    discipline_name: string | null;
    teacher_name: string | null;
    specific_objectives_html: string;
    objectives_deadline_html: string;
    content_programmatic_html: string;
    curricular_reference_html: string;
    methodologies_html: string;
    materials_and_assistive_technology_html: string;
    evaluations_html: string;
    complementary_records_html: string;
    opinion_html: string;
}

export interface PeiDisciplineShowPermissions {
    update: boolean;
    delete: boolean;
    addRevision: boolean;
    pdf: boolean;
}

export interface PeiDisciplineShowProps {
    pei: {
        id: number;
        version: number | null;
        is_finished: boolean;
    };
    student: {
        id: number;
        name: string;
    };
    peiDiscipline: PeiDisciplineDetails;
    revisions: PeiDisciplineRevision[];
    can: PeiDisciplineShowPermissions;
}

export interface PeiDisciplineRevision {
    id: number;
    reviewed_at: string | null;
    reviewer_name: string | null;
    what_changed: string;
    why: string;
}

/** Disciplina do curso ainda sem adaptação, com os professores vinculados na matriz. */
export interface PeiBulkDiscipline {
    id: number;
    name: string;
    /** Período do curso em que a disciplina é cursada, conforme a matriz. */
    course_period: number | null;
    /** Disciplina do período do aluno no semestre do PEI ou dependência pendente. */
    suggested: boolean;
    /** Semestre da reprovação, quando a disciplina é dependência pendente. */
    dependency_semester_label: string | null;
    teachers: SelectFieldOption[];
}

/** Cadastro em lote das adaptações (`PeiDisciplineFormQuery@forCreation`). */
export interface PeiDisciplineBulkProps {
    pei: { id: number };
    semesterLabel: string | null;
    /** Período do curso do aluno no semestre do PEI; nulo quando não informado na matrícula. */
    studentPeriod: number | null;
    disciplines: PeiBulkDiscipline[];
}

/** Adaptação em edição (`PeiDisciplineFormQuery@forUpdate`). */
export interface PeiDisciplineRecord {
    id: number;
    teacher_id: number;
    discipline_id: number;
    specific_objectives: string | null;
    content_programmatic: string | null;
    methodologies: string | null;
    evaluations: string | null;
    complementary_records: string | null;
    opinion: string | null;
    curricular_reference: string | null;
    materials_and_assistive_technology: string | null;
    objectives_deadline: string | null;
    teacher?: { person?: { name: string } | null } | null;
    discipline?: { name: string } | null;
}

export interface PeiDisciplineEditProps {
    pei: { id: number };
    peiDiscipline: PeiDisciplineRecord;
}
