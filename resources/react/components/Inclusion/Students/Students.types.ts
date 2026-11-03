import type { SupportRequestSummary } from '@/components/Inclusion/SupportRequests/SupportRequests.types';
import type { LoanRecord } from '@/components/Inclusion/Loans/Loans.types';
import type { TableListPage } from '@/components/Tables/TableList/TableList';

export type Permissions = Record<string, boolean>;
export type StatusColor = 'success' | 'warning' | 'primary' | 'danger' | 'info';
export interface StudentOptions {
    permissions: Permissions;
    studentStatuses: Record<string, string>;
    followUpTypes: Record<string, string>;
    statusColors: Record<string, StatusColor>;
}
export interface Person {
    id: number;
    name: string;
    document: string | null;
    birth_date: string | null;
    gender: string;
    gender_label: string;
    age: number | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    photo: string | null;
    photo_url: string;
    address_html: string;
}
export interface Student {
    id: number;
    person: Person;
    registration: string;
    entry_date: string | null;
    status: string;
    follow_up_type: string | null;
}
/** Opções do cadastro e da edição (`StudentFormQuery`). */
export interface StudentFormOptions extends StudentOptions {
    genders: Record<string, string>;
    defaultGender?: string;
    defaultStatus: string;
}
export type StudentEditProps = StudentFormOptions & { student: Student };
export type StudentFilters = Record<
    | 'name'
    | 'phone'
    | 'email'
    | 'status'
    | 'follow_up_type'
    | 'course_id'
    | 'deficiency_id'
    | 'registration'
    | 'per_page',
    string
>;
export interface StudentIndexProps extends StudentOptions {
    students: TableListPage & { data: Student[] };
    courses: Array<{ id: number; name: string }>;
    deficiencies: Array<{ id: number; name: string }>;
    filters: Partial<StudentFilters>;
}
export interface StudentRecord extends Student {
    student_courses?: Array<{
        id: number;
        course: { name: string } | null;
        academic_year: number;
        semester_label?: string | null;
        is_current: boolean;
        created_at?: string | null;
    }>;
    guardians?: Array<{ id: number; person: Person; relationship_label: string }>;
    deficiencies?: Array<{
        id: number;
        student_deficiency_id: number;
        name: string;
        severity_label: string | null;
        severity_color: string | null;
    }>;
    documents?: Array<{
        id: number;
        title: string;
        original_name: string;
        type_label: string;
        semester_label: string | null;
        file_size: number;
        created_at: string;
    }>;
    peis?: Array<{
        id: number;
        semester_label: string | null;
        course: { name: string } | null;
        teacher_names: string[];
        is_finished: boolean;
        is_current: boolean;
        version: number;
        created_at: string;
    }>;
}
export interface AttendanceSession {
    session_date: string | null;
    start_time?: string | null;
    end_time?: string | null;
    professional_id?: number | null;
    professional: { person: { name: string } } | null;
}
export interface AeeEvaluation {
    id: number;
    is_present: boolean;
    can_manage?: boolean;
    aee_record: {
        duration: number | string | null;
        attendance_session: AttendanceSession | null;
    } | null;
}
export interface PedagogicalRecord {
    id: number;
    duration: number | string;
    is_present: boolean;
    can_manage?: boolean;
    attendance_session: AttendanceSession | null;
    guardians: Array<{ id: number }>;
}
export interface StudentCaseStudySummary {
    id: number;
    version: number;
    semester_label: string | null;
    status: string;
    status_label: string;
    created_at: string | null;
}
export interface StudentPaeeSummary {
    id: number;
    version: number;
    is_current: boolean;
    semester_label: string | null;
    status: string;
    status_label: string;
    next_review_date: string | null;
}
export interface StudentStatusItem {
    key: string;
    label: string;
    ok: boolean;
    optional?: boolean;
    status: string;
    icon: string;
    href: string | null;
    action_label: string;
    updated_at: string | null;
}
export interface StudentStatusPanelData {
    items: StudentStatusItem[];
    alerts: string[];
}
export interface StudentShowProps extends StudentOptions {
    student: StudentRecord;
    profileNames: string[];
    studentCourses?: NonNullable<StudentRecord['student_courses']>;
    supportProfiles?: NonNullable<StudentRecord['deficiencies']>;
    guardians?: NonNullable<StudentRecord['guardians']>;
    peis?: NonNullable<StudentRecord['peis']>;
    documents?: NonNullable<StudentRecord['documents']>;
    aeeEvaluations?: AeeEvaluation[];
    pedagogicalRecords?: PedagogicalRecord[];
    caseStudies?: StudentCaseStudySummary[];
    paees?: StudentPaeeSummary[];
    /** Empréstimos do Radar; vazio quando o usuário não pode listá-los. */
    loans?: LoanRecord[];
    supportRequests?: SupportRequestSummary[];
    statusPanel: StudentStatusPanelData;
    activeTab?: string;
}

export type StudentRecordTabId =
    | 'personal-data'
    | 'academic-data'
    | 'support-profiles'
    | 'guardians'
    | 'case-studies'
    | 'paees'
    | 'peis'
    | 'documents'
    | 'aee-attendance'
    | 'pedagogical-attendance'
    | 'loans'
    | 'support-requests';
