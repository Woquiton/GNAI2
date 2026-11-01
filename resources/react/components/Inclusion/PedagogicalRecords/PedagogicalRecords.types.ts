export interface PedagogicalRecordGuardianOption {
    id: number;
    name: string;
    relationship_label: string;
}

export interface PedagogicalRecordFormContext {
    session_id: number;
    session_objective: string | null;
    student_name: string | null;
    professional_name: string | null;
    session_date: string | null;
    start_time: string;
    end_time: string | null;
    attendance_type_label: string;
    guardians: PedagogicalRecordGuardianOption[];
}

export interface PedagogicalRecordFormRecord {
    id: number;
    follow_up_reason: string | null;
    duration: string | null;
    is_present: boolean;
    absence_reason: string | null;
    systematic_pedagogical_follow_up_record: string | null;
    strategies_and_resources_adopted: string | null;
    referrals_made: string | null;
    complementary_observations: string | null;
    guardians?: Array<{ id: number }>;
}

export interface PedagogicalRecordListRow {
    id: number;
    session_date: string | null;
    start_time: string | null;
    end_time: string | null;
    duration: number | string | null;
    is_present: boolean;
    has_guardians: boolean;
    student_name: string | null;
    course_name: string | null;
    professional_name: string | null;
    can_manage: boolean;
}

export interface PedagogicalRecordPaginator {
    data: PedagogicalRecordListRow[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

export type PedagogicalRecordFilterName =
    | 'student'
    | 'professional_id'
    | 'course_id'
    | 'is_present'
    | 'with_guardians';

export type PedagogicalRecordFilters = Record<PedagogicalRecordFilterName, string>;

export interface PedagogicalRecordOption {
    id: number;
    name: string;
}

export interface PedagogicalRecordListAbilities {
    view: boolean;
    view_all: boolean;
    view_own: boolean;
    update: boolean;
    delete: boolean;
}

export interface PedagogicalRecordListProps {
    pedagogicalRecords: PedagogicalRecordPaginator;
    students: PedagogicalRecordOption[];
    professionals: PedagogicalRecordOption[];
    courses: PedagogicalRecordOption[];
    filters: Partial<PedagogicalRecordFilters>;
    can: PedagogicalRecordListAbilities;
}

export type PedagogicalRecordShowRecord = Omit<PedagogicalRecordFormRecord, 'guardians'> & {
    has_guardians: boolean;
    guardian_names: string;
};

export interface PedagogicalRecordShowSession {
    id: number;
    session_date: string | null;
    start_time: string | null;
    end_time: string | null;
    student_name: string | null;
    professional_name: string | null;
}

export interface PedagogicalRecordShowAbilities {
    update: boolean;
    delete: boolean;
    pdf: boolean;
}

export interface PedagogicalRecordShowProps {
    pedagogicalRecord: PedagogicalRecordShowRecord;
    session: PedagogicalRecordShowSession;
    can: PedagogicalRecordShowAbilities;
    returnStudentId?: number;
}

export type StudentPedagogicalRecordIndexProps = PedagogicalRecordListProps & {
    student: { id: number; name: string | null };
};

export interface PedagogicalRecordCreateProps {
    context: PedagogicalRecordFormContext;
}

export interface PedagogicalRecordEditProps {
    pedagogicalRecord: PedagogicalRecordFormRecord;
    context: PedagogicalRecordFormContext;
    returnStudentId?: number;
}
