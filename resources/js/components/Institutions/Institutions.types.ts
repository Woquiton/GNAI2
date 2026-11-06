import type { GeoPoint } from '@/components/GeoMap/GeoMap.types';
import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Instituição base (sede) enviada por `InstitutionController`. */
export type InstitutionRecord = GeoPoint & {
    id: number;
    name: string;
    short_name: string | null;
    city: string;
    state: string;
    district: string | null;
    address: string | null;
    default_zoom: number;
    is_active: boolean;
};

export interface InstitutionPaginator extends TableListPage {
    data: InstitutionRecord[];
}

export type InstitutionFilters = {
    name: string;
    location: string;
    is_active: string;
};

export interface InstitutionListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}

export interface InstitutionIndexProps {
    institutions: InstitutionPaginator;
    filters: Partial<InstitutionFilters>;
    can: InstitutionListPermissions;
}

export interface InstitutionCreateProps {
    canSubmit: boolean;
}

export interface InstitutionEditProps {
    institution: InstitutionRecord;
    canSubmit: boolean;
}

export interface InstitutionDetailsPermissions {
    edit: boolean;
    destroy: boolean;
}

export interface InstitutionShowProps {
    institution: InstitutionRecord;
    can: InstitutionDetailsPermissions;
}
