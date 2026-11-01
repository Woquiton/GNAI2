import type { TableListPage } from '@/components/Tables/TableList/TableList';

export interface ProfessionalPerson {
    id: number;
    name: string;
    document: string | null;
    birth_date: string | null;
    gender: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    photo: string | null;
    photo_url?: string | null;
}

export interface ProfessionalRecord {
    id: number;
    person: ProfessionalPerson;
    position_id: number | null;
    registration: string;
    entry_date: string | null;
    status: string | null;
    show_on_website?: boolean;
    user?: { id: number; is_admin: boolean } | null;
}

/** Opções de `ProfessionalFormQuery` para cadastro e edição. */
export interface ProfessionalFormOptions {
    positions: Array<{ id: number; name: string }>;
    genders: Record<string, string>;
    professionalStatuses: Record<string, string>;
    defaultGender?: string;
    defaultStatus?: string;
    canManageAdministrators: boolean;
}

/** Linha da listagem (`ProfessionalController@index`). */
export interface ProfessionalListRecord {
    entry_date: string | null;
    id: number;
    person: Pick<ProfessionalPerson, 'id' | 'name' | 'email' | 'phone'> & {
        photo_url?: string | null;
    };
    position: { id: number; name: string } | null;
    registration: string;
    status: string | null;
    show_on_website?: boolean;
}

export type ProfessionalFilters = {
    name: string;
    email: string;
    registration: string;
    position: string;
    status: string;
};

export interface ProfessionalPaginator extends TableListPage {
    data: ProfessionalListRecord[];
}

export interface ProfessionalListPermissions {
    create: boolean;
    view: boolean;
    delete: boolean;
}

export interface ProfessionalIndexProps {
    professionals: ProfessionalPaginator;
    positions: Array<{ id: number; name: string }>;
    professionalStatuses: Record<string, string>;
    professionalStatusColors: Record<string, string>;
    filters: Partial<ProfessionalFilters>;
    can: ProfessionalListPermissions;
}

export interface ProfessionalDetailsPermissions {
    update: boolean;
    delete: boolean;
}

export type ProfessionalEditProps = ProfessionalFormOptions & { professional: ProfessionalRecord };

/** Dados da visualização (`ProfessionalController@show`). */
export interface ProfessionalShowProps {
    professional: ProfessionalRecord & {
        position: { id: number; name: string } | null;
    };
    display: {
        statusLabel: string | null;
        statusColor: string | null;
        serviceTime: string | null;
    };
    impersonationUserId: number | null;
    can: ProfessionalDetailsPermissions;
}

export type ProfessionalViewerProps = { auth?: { user?: { is_admin?: boolean } | null } };
