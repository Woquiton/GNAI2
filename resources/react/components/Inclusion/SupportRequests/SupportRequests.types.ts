import type { TableLabelTone } from '@/components/UI/TableLabel/TableLabel';
import type { TableListPage } from '@/components/Tables/TableList/TableList';

export interface SupportRequestOption {
    value: string;
    label: string;
}
export interface SupportRequestPermissions {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}
export interface SupportRequestSummary {
    id: number;
    student_id: number;
    student_name: string;
    registration: string;
    request_date: string;
    request_date_label: string;
    requester_name: string;
    requester_role: string;
    requester_role_label: string;
    status: string;
    status_label: string;
    created_by_name: string;
    created_at_label: string;
    updated_at_label: string;
}
export interface SupportRequestAttachment {
    id: number;
    name: string;
    url: string;
}
export interface SupportRequestRecord extends SupportRequestSummary {
    course_id: number | null;
    course_name: string | null;
    requester_other: string | null;
    requester_contact: string | null;
    student_contact: string | null;
    student_status_label: string;
    student_status_tone: TableLabelTone;
    courses: string[];
    reason_type: string;
    reason_type_label: string;
    reason_profile_ids: string[];
    reason_profiles: { id: number; name: string }[];
    reason: string | null;
    school_difficulties: string | null;
    diagnosis_status: string;
    diagnosis_status_label: string;
    diagnosis_notes: string | null;
    requested_supports: string[];
    requested_support_labels: string[];
    other_support: string | null;
    analysis_notes: string | null;
    referrals: string | null;
    attachments: SupportRequestAttachment[];
}
export interface SupportRequestOptions {
    students: SupportRequestOption[];
    courses: SupportRequestOption[];
    statuses: SupportRequestOption[];
    requesterRoles: SupportRequestOption[];
    diagnosisStatuses: SupportRequestOption[];
    supports: SupportRequestOption[];
    reasonTypes: SupportRequestOption[];
    reasonProfiles: SupportRequestOption[];
}
export type SupportRequestFilters = { search: string; status: string; student_id: string };
export interface SupportRequestPaginator extends TableListPage {
    data: SupportRequestSummary[];
}
export interface SupportRequestIndexProps {
    requests: SupportRequestPaginator;
    filters: Partial<SupportRequestFilters>;
    statuses: SupportRequestOption[];
    students: SupportRequestOption[];
    can: SupportRequestPermissions;
}
export interface SupportRequestDefaults {
    requester_role: string;
    diagnosis_status: string;
    status: string;
}
export interface SupportRequestCreateProps {
    options: SupportRequestOptions;
    selectedStudentId: string;
    today: string;
    defaults: SupportRequestDefaults;
}
export interface SupportRequestEditProps {
    options: SupportRequestOptions;
    supportRequest: SupportRequestRecord;
}
export interface SupportRequestShowProps {
    supportRequest: SupportRequestRecord;
    can: SupportRequestPermissions;
}
