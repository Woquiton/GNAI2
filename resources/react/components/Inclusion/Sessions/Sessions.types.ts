import type { SelectFieldOption } from '@/components/Forms/SelectField/SelectField.types';
import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Linha da listagem, do calendário e do modal do dia (`SessionListPresenter::row`). */
export interface SessionListRow {
    id: number;
    session_date: string | null;
    start_time: string | null;
    end_time: string | null;
    type_label: string;
    status_label: string;
    status_color: string;
    is_scheduled: boolean;
    professional_name: string;
    student_names: string[];
    has_record: boolean;
    record_label: string;
    can_delete: boolean;
}

export interface SessionListPaginator extends TableListPage {
    data: SessionListRow[];
}

export type SessionListFilters = {
    student: string;
    professional: string;
    type: string;
    status: string;
    week: string;
    student_agenda: string;
    professional_agenda: string;
};

/** Filtros compartilhados pelo calendário e pela listagem (central e meus agendamentos). */
export type SessionWorkspaceFilterValues = Pick<
    SessionListFilters,
    'week' | 'student' | 'professional' | 'type' | 'status'
>;

/** Filtros da listagem de agendamentos do aluno. */
export type SessionStudentFilterValues = Pick<
    SessionListFilters,
    'professional' | 'type' | 'status'
>;

export interface SessionListOptions {
    students?: SelectFieldOption[];
    professionals?: SelectFieldOption[];
    types: SelectFieldOption[];
    statuses: SelectFieldOption[];
}

export interface SessionCalendarData {
    rangeStart: string;
    rangeEnd: string;
    total: number;
    sessions: SessionListRow[];
}

export type SessionView = 'calendar' | 'list';

export interface SessionIndexProps {
    sessions: SessionListPaginator;
    calendar: SessionCalendarData;
    view: SessionView;
    filters: SessionListFilters;
    options: SessionListOptions;
    can: {
        create: boolean;
        view: boolean;
        mySessions: boolean;
    };
}

export interface SessionMySessionsProps {
    sessions: SessionListPaginator;
    calendar: SessionCalendarData;
    view: SessionView;
    filters: SessionListFilters;
    options: SessionListOptions;
    can: {
        create: boolean;
        view: boolean;
        viewAll: boolean;
    };
}

export interface SessionStudentIndexProps {
    sessions: SessionListPaginator;
    student: {
        id: number;
        name: string;
    };
    filters: SessionListFilters;
    options: SessionListOptions;
    can: {
        view: boolean;
    };
}

/** Registro de atendimento (AEE ou pedagógico) ligado ao agendamento. */
export interface SessionShowRecord {
    kind: 'aee' | 'pedagogical';
    show_url: string | null;
    pdf_url: string | null;
    create_url: string | null;
}

export interface SessionDetailsRecord {
    id: number;
    student_names: string[];
    professional_name: string;
    status_label: string;
    status_color: string;
    is_scheduled: boolean;
    session_date: string | null;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    attendance_type_label: string;
    type_label: string;
    /** Agendamento ou registro direto do atendimento (`SessionOrigin`). */
    origin_label: string;
    session_objective: string | null;
    session_objective_html: string;
    cancellation_reason: string | null;
}

export interface SessionDetailsPermissions {
    edit: boolean;
    cancel: boolean;
    delete: boolean;
}

export interface SessionShowProps {
    session: SessionDetailsRecord;
    record: SessionShowRecord | null;
    can: SessionDetailsPermissions;
    backUrl: string;
}

/** Agendamento que pode ser excluído (listagem, modal do dia e visualização). */
export interface SessionRemovalTarget {
    id: number;
    is_scheduled: boolean;
}

export type SessionOptionMap = Record<string, string>;

export interface SessionPersonOption {
    id: number;
    person?: {
        name?: string | null;
    } | null;
}

/** Agendamento recebido pela edição (`SessionFormQuery::forUpdate`). */
export interface SessionRecord {
    id: number;
    professional_id: number;
    status: string | null;
    type: string;
    location: string | null;
    session_objective: string | null;
    students: SessionPersonOption[];
    professional?: SessionPersonOption | null;
}

export interface SessionFormValues {
    attendance_type: string;
    session_date: string;
    start_time: string;
    end_time: string;
}

export interface SessionTimeOptions {
    startTimes: SessionOptionMap;
    endTimes: SessionOptionMap;
    attendanceTypes: SessionOptionMap;
    sessionTypes: SessionOptionMap;
}

export interface SessionCreateProps extends SessionTimeOptions {
    students: SessionPersonOption[];
    professionals: SessionPersonOption[];
    defaults: {
        attendance_type: string;
        type: string;
    };
}

export interface SessionEditProps extends SessionTimeOptions {
    session: SessionRecord;
    sessionForm: SessionFormValues;
}

/** Horário retornado por `GET /inclusao/agendamentos/disponibilidade`. */
export interface SessionAvailabilitySlot {
    time: string;
    busy: boolean;
    busy_type: string;
}

export type SessionStudentFilterKey = keyof SessionStudentFilterValues;

/* Cabeçalho dos registros de atendimento (AEE e pedagógico) */

/** Data, horário e local corrigíveis na edição do registro (`SessionFormQuery::forAttendanceCorrection`). */
export interface AttendanceCorrectionValues {
    session_date: string;
    start_time: string;
    end_time: string;
    location: string;
}

export interface AttendanceCorrectionProps extends Pick<
    SessionTimeOptions,
    'startTimes' | 'endTimes'
> {
    attendanceTypeLabel: string;
    attendanceForm: AttendanceCorrectionValues;
}

export interface AttendanceGuardianOption {
    id: number;
    name: string;
    relationship_label: string;
}

/** Registro direto de atendimento já realizado (`SessionFormQuery::forDirectRecord`). */
export interface DirectAttendanceProps extends Pick<
    SessionTimeOptions,
    'startTimes' | 'endTimes' | 'sessionTypes'
> {
    attendanceTypeLabel: string;
    students: SessionPersonOption[];
    /** Responsáveis de cada aluno elegível, indexados pelo id do aluno. */
    guardiansByStudent: Record<number, AttendanceGuardianOption[]>;
    /** Profissional do usuário logado, responsável pelo atendimento. */
    professional: { id: number; name: string | null };
}
