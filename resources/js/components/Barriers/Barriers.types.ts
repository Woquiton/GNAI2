import type { GeoMapReference } from '@/components/GeoMap/GeoMap.types';
import type { InspectionHistoryItem } from '@/components/Inspections/InspectionHistoryTable/InspectionHistoryTable.types';
import type { FieldOption } from '@/components/Forms/FormFields/FormFields.types';
import type { TableListPage } from '@/components/Tables/TableList/TableList';

export type BarrierOption = FieldOption;

/** Instituição com sede, zoom padrão e pontos de referência ativos (`BarrierFormQuery`). */
export type BarrierInstitution = Omit<GeoMapReference, 'locations'> & {
    locations: { id: number; name: string; label: string; latitude: number; longitude: number }[];
};

export type BarrierCategory = { id: number; name: string; blocks_map: boolean };

export type BarrierDeficiency = { id: number; name: string };

export type BarrierEvidence = {
    id: number;
    path: string;
    original_name: string | null;
    mime_type: string | null;
    size: number;
};

export type BarrierInspection = {
    id: number;
    status: string | null;
    type: string | null;
    inspection_date: string;
    description: string | null;
    created_at: string;
    evidences?: BarrierEvidence[];
};

/** Modelo `Barrier` serializado com as relações carregadas por cada tela. */
export type BarrierRecord = {
    id: number;
    name: string;
    description: string | null;
    institution_id: number;
    barrier_category_id: number;
    location_id: number | null;
    location_specific_details: string | null;
    affected_student_id?: number | string | null;
    affected_professional_id?: number | string | null;
    priority: string;
    identified_at: string;
    latitude: number | string | null;
    longitude: number | string | null;
    is_anonymous: boolean;
    not_applicable: boolean;
    affected_person_name: string | null;
    affected_person_role: string | null;
    is_active: boolean;
    category?: { id: number; name: string; blocks_map?: boolean } | null;
    institution?: {
        id: number;
        name: string;
        latitude?: number | string;
        longitude?: number | string;
        default_zoom?: number;
    } | null;
    location?: { id: number; name: string } | null;
    priority_label?: string;
    status_label?: string;
    status?: string | null;
    deficiencies?: { id: number; name: string }[];
    inspections?: BarrierInspection[];
    affected_student?: { person?: { name: string } } | null;
    affected_professional?: { person?: { name: string } } | null;
    registered_by?: { name: string } | null;
};

export interface BarrierPaginator extends TableListPage {
    data: BarrierRecord[];
}

export type BarrierFilters = {
    institution_name: string;
    location_name: string;
    is_active: string;

    created_from: string;
    created_to: string;
    name: string;
    category: string;
    priority: string;
    status: string;
};

export interface BarrierListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}

export interface BarrierIndexProps {
    barriers: BarrierPaginator;
    filters: Partial<BarrierFilters>;
    can: BarrierListPermissions;
}

/** Opções de `BarrierFormQuery`, comuns ao cadastro e à edição. */
export interface BarrierFormOptions {
    institutions: BarrierInstitution[];
    categories: BarrierCategory[];
    deficiencies: BarrierDeficiency[];
    students: Record<string, string>;
    professionals: Record<string, string>;
    priorities: BarrierOption[];
    barrierStatuses: BarrierOption[];
    selectedInstitution: BarrierInstitution | null;
    canSubmit: boolean;
}

export type BarrierCreateProps = BarrierFormOptions;

export type BarrierEditProps = BarrierFormOptions & { barrier: BarrierRecord };

export interface BarrierDetailsDisplay {
    descriptionHtml: string;
    locationDetailsHtml: string | null;
    inspectionDetails: InspectionHistoryItem[];
}

export interface BarrierDetailsPermissions {
    edit: boolean;
    destroy: boolean;
    pdf: boolean;
    inspectionShow: boolean;
}

export interface BarrierShowProps {
    barrier: BarrierRecord;
    display: BarrierDetailsDisplay;
    can: BarrierDetailsPermissions;
}

export interface BarrierInspectionShowProps {
    barrier: BarrierRecord;
    inspection: BarrierInspection;
    descriptionHtml: string;
}
