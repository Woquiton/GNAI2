import type {
    SupportRequestDefaults,
    SupportRequestOptions,
    SupportRequestRecord,
} from '../SupportRequests.types';

export type SupportRequestFormData = {
    student_id: string;
    request_date: string;
    requester_name: string;
    requester_role: string;
    course_id: string;
    requester_other: string;
    requester_contact: string;
    reason_type: string;
    reason_profile_ids: string[];
    reason: string;
    school_difficulties: string;
    diagnosis_status: string;
    diagnosis_notes: string;
    requested_supports: string[];
    other_support: string;
    status: string;
    analysis_notes: string;
    referrals: string;
    attachments: File[];
    remove_attachment_ids: number[];
};
export interface SupportRequestFormProps {
    fromStudent?: boolean;
    options: SupportRequestOptions;
    supportRequest?: SupportRequestRecord;
    selectedStudentId?: string;
    today?: string;
    defaults?: SupportRequestDefaults;
}
export interface SupportRequestFieldsProps {
    data: SupportRequestFormData;
    errors: Record<string, string | undefined>;
    disabled: boolean;
    update: <K extends keyof SupportRequestFormData>(
        key: K,
        value: SupportRequestFormData[K],
    ) => void;
}
