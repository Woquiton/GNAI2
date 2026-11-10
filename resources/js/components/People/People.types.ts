import type { TableListPage } from '@/components/Tables/TableList/TableList';

export type PersonRole = 'student' | 'teacher' | 'professional' | 'guardian';
export interface GuardianLink {
    student_id: string;
    relationship: string;
}
export interface RoleDetails {
    registration: string;
    entry_date: string;
    status: string;
    follow_up_type: string;
    position_id: string;
    show_on_website: boolean;
    links: GuardianLink[];
}
export interface PersonFormData {
    name: string;
    document: string;
    birth_date: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    photo: File | null;
    remove_photo: boolean;
    roles: PersonRole[];
    details: Record<PersonRole, RoleDetails>;
    tag_ids: number[];
}
export interface PersonRecord {
    id: number;
    name: string;
    document: string | null;
    birth_date: string;
    gender: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    photo_url: string;
    student: {
        registration: string;
        entry_date: string | null;
        status: string;
        follow_up_type: string | null;
    } | null;
    teacher: { registration: string } | null;
    professional: {
        registration: string;
        entry_date: string;
        status: string;
        position_id: number;
        show_on_website: boolean;
    } | null;
    guardians: { student_id: number; relationship: string }[];
    tags: { id: number; name: string }[];
}
export interface PersonFormProps {
    person: PersonRecord | null;
    genders: Record<string, string>;
    studentStatuses: Record<string, string>;
    professionalStatuses: Record<string, string>;
    followUpTypes: Record<string, string>;
    relationships: Record<string, string>;
    positions: { id: number; name: string }[];
    students: { id: number; name: string }[];
    tags: { id: number; name: string }[];
    specialTags: { system_key: PersonRole; name: string }[];
    defaults: { gender: string; studentStatus: string; professionalStatus: string };
    canRoles: Record<PersonRole, boolean>;
    canSave: boolean;
}
export interface PersonListRow {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    roles: string[];
    tags: string[];
}
export type PersonFilters = {
    name: string;
    tag_id: string;
    created_from: string;
    created_to: string;
    email: string;
    phone: string;
};

export interface PeopleIndexProps {
    people: TableListPage & { data: PersonListRow[] };
    tags: { id: number; name: string; system_key: PersonRole | null }[];
    filters: Partial<PersonFilters>;
    can: { create: boolean; edit: boolean };
}
