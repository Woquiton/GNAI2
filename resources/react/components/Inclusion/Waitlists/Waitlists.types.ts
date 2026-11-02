import type { ItemType } from '@/components/Inclusion/Items/Items.types';
import type { TableListPage } from '@/components/Tables/TableList/TableList';

export interface WaitlistResource {
    id: number;
    item_type: ItemType;
    name?: string | null;
    title?: string | null;
    asset_code?: string | null;
    description?: string | null;
}

export interface WaitlistPerson {
    name: string;
    registration?: string | null;
}

export type WaitlistStatus = 'waiting' | 'notified' | 'fulfilled' | 'cancelled';

/** Solicitação apresentada por `WaitlistPresenter::waitlist`. */
export interface WaitlistRecord {
    id: number;
    waitlistable_id: number;
    item_type: ItemType;
    item_name: string;
    asset_code?: string | null;
    student: WaitlistPerson | null;
    professional: WaitlistPerson | null;
    user: string;
    requested_at: string | null;
    requested_at_label: string;
    status: WaitlistStatus;
    status_label: string;
    status_color: string;
    observation: string | null;
    observation_html?: string;
}

export interface WaitlistPaginator extends TableListPage {
    data: WaitlistRecord[];
}

export type WaitlistFilters = {
    item: string;
    student: string;
    professional: string;
    status: string;
};

export interface WaitlistListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}

export interface WaitlistIndexProps {
    waitlists: WaitlistPaginator;
    filters: Partial<WaitlistFilters>;
    can: WaitlistListPermissions;
}

export interface WaitlistStudentOption {
    id: number;
    name: string;
    registration: string;
}

export interface WaitlistProfessionalOption {
    id: number;
    name: string;
}

/** Props do cadastro (`WaitlistFormQuery::forCreation`). */
export interface WaitlistCreateProps {
    students: Record<string, string> | WaitlistStudentOption[];
    professionals: Record<string, string> | WaitlistProfessionalOption[];
    authUser: { id: number; name: string };
    itemTypes?: Record<string, string>;
    items?: WaitlistResource[];
    can: { submit: boolean };
}

/** Props da edição (`WaitlistFormQuery::forUpdate`); só as observações são editáveis. */
export interface WaitlistEditProps {
    waitlist: WaitlistRecord;
    authUser: { id: number; name: string };
    statusLabel?: string;
    can: { submit: boolean };
}

export interface WaitlistDetailsPermissions {
    edit: boolean;
    cancel: boolean;
    destroy: boolean;
    pdf: boolean;
}

export interface WaitlistShowProps {
    waitlist: WaitlistRecord;
    canCancel: boolean;
    statusLabel: string;
    statusColor: string;
    can: WaitlistDetailsPermissions;
}
