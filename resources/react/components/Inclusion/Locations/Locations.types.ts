import type {
    GeoMapMarker,
    GeoMapReference,
    GeoPoint,
} from '@/components/Inclusion/GeoMap/GeoMap.types';
import type { FieldOption } from '@/components/Forms/FormFields/FormFields.types';
import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Ponto de referência enviado por `LocationController`. */
export type LocationRecord = GeoPoint & {
    id: number;
    institution_id: number;
    name: string;
    type: string | null;
    description: string | null;
    is_active: boolean;
    institution?: {
        id: number;
        name: string;
        latitude: number | string;
        longitude: number | string;
        default_zoom?: number;
    };
};

export interface LocationPaginator extends TableListPage {
    data: LocationRecord[];
}

export type LocationFilters = {
    name: string;
    institution_name: string;
    is_active: string;
};

export interface LocationListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}

export interface LocationIndexProps {
    locations: LocationPaginator;
    filters: Partial<LocationFilters>;
    can: LocationListPermissions;
}

/** Instituição com sede, zoom padrão e pontos já cadastrados, para o mapa do formulário. */
export type InstitutionMapData = GeoMapReference & { locations?: GeoMapMarker[] };

/** Opções e dados de mapa de `LocationFormQuery`, comuns ao cadastro e à edição. */
export interface LocationFormOptions {
    institutions: FieldOption[];
    institutionsData: InstitutionMapData[];
    selectedInstitution: { id: number } | null;
    canSubmit: boolean;
}

export type LocationCreateProps = LocationFormOptions;

export type LocationEditProps = LocationFormOptions & { location: LocationRecord };

export interface LocationDetailsPermissions {
    edit: boolean;
    destroy: boolean;
}

export interface LocationShowProps {
    location: LocationRecord;
    display: { descriptionHtml: string };
    can: LocationDetailsPermissions;
}
