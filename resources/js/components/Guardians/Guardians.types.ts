import type { TableListPage } from '@/components/Tables/TableList/TableList';

export interface GuardianStudent {
    id: number;
    person: { name: string };
}

export interface GuardianPerson {
    name: string;
    document: string | null;
    birth_date: string | null;
    gender: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    photo: string | null;
    photo_url?: string;
}

export interface GuardianRecord {
    id: number;
    relationship: string | null;
    person: GuardianPerson;
}

/** Opções do cadastro e da edição (`GuardianFormQuery`). */
export interface GuardianFormOptions {
    student: GuardianStudent;
    genders: Record<string, string>;
    relationships: Record<string, string>;
}

export type GuardianCreateProps = GuardianFormOptions & { defaultGender?: string };

export type GuardianEditProps = GuardianFormOptions & { guardian: GuardianRecord };

export type GuardianFilters = {
    phone: string;

    created_from: string;
    created_to: string;
    name: string;
    email: string;
    relationship: string;
};

export interface GuardianPaginator extends TableListPage {
    data: GuardianRecord[];
}

export interface GuardianListPermissions {
    create: boolean;
    view: boolean;
    delete: boolean;
}

export interface GuardianIndexProps {
    student: GuardianStudent;
    guardians: GuardianPaginator;
    relationships: Record<string, string>;
    filters: Partial<GuardianFilters>;
    can: GuardianListPermissions;
}

export interface GuardianShowProps {
    guardian: GuardianRecord;
    student: GuardianStudent;
    display: {
        relationshipLabel: string | null;
        genderLabel: string | null;
        age: number | null;
        addressHtml: string;
    };
    can: { update: boolean; delete: boolean };
}
