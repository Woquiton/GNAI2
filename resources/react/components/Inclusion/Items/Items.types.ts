import type { InspectionDetailsData } from '@/components/Inclusion/Inspections/InspectionDetails/InspectionDetails.types';
import type { InspectionHistoryItem } from '@/components/Inclusion/Inspections/InspectionHistoryTable/InspectionHistoryTable.types';
import type { LoanRecord } from '@/components/Inclusion/Loans/Loans.types';
import type { TableListPage } from '@/components/Tables/TableList/TableList';

export type ItemType = 'assistive_technology' | 'accessible_educational_material';

export interface NamedRecord {
    id: number;
    name: string;
}

/** Linha da listagem (`ItemController@index`). */
export interface ItemSummary {
    id: number;
    item_type: ItemType;
    name: string;
    is_digital: boolean;
    is_active: boolean;
    quantity: number | null;
    quantity_available: number | null;
    asset_code: string | null;
    is_loanable: boolean;
    conservation_state_label: string | null;
    resource_status_label: string | null;
    deficiencies: NamedRecord[];
    accessibility_features: NamedRecord[];
    created_at: string | null;
    updated_at: string | null;
    catalog_image_url: string | null;
}

export interface ItemPaginator extends TableListPage {
    data: ItemSummary[];
}

export type ItemFilters = {
    name: string;
    item_type: string;
    is_digital: string;
    accessibility_feature_id: string;
    is_active: string;
    available: string;
    per_page: string;
};

export interface ItemListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}

export interface ItemIndexProps {
    items: ItemPaginator;
    filters: Partial<ItemFilters>;
    itemTypeOptions: Record<string, string>;
    accessibilityFeatureOptions: Record<string, string>;
    can: ItemListPermissions;
}

/** Registro completo usado na edição e na clonagem. */
export interface ItemRecord {
    id: number;
    item_type: ItemType;
    name: string;
    is_digital: boolean;
    is_loanable: boolean;
    quantity: number | null;
    asset_code: string | null;
    conservation_state: string | null;
    status: string | null;
    notes: string | null;
    is_active: boolean;
    deficiencies: NamedRecord[];
    accessibility_features: NamedRecord[];
}

/** Opções compartilhadas pelas telas de cadastro e edição. */
export interface ItemFormOptions {
    itemTypes: Record<string, string>;
    deficiencies: NamedRecord[];
    accessibilityFeatures: NamedRecord[];
    resourceStatuses: Record<string, string>;
    conservationStates: Record<string, string>;
    inspectionTypes: Record<string, string>;
    defaultInspection: string;
    defaultStatus?: string;
    can: { submit: boolean };
}

export type ItemCreateProps = ItemFormOptions & { cloneSource?: ItemRecord | null };

export type ItemEditProps = ItemFormOptions & {
    item: ItemRecord;
    activeLoans: number;
};

/** Dados da visualização (`ItemController@show`). */
export interface ItemDetailsRecord {
    id: number;
    name: string;
    is_digital: boolean;
    asset_code: string | null;
    quantity: number | null;
    quantity_available: number | null;
    status: string | null;
    is_loanable: boolean;
    is_active: boolean;
}

export interface ItemDetailsDisplay {
    itemTypeLabel: string;
    notesHtml: string;
    statusLabel: string;
    inspectionDetails: InspectionHistoryItem[];
}

export interface ItemDetailsPermissions {
    clone: boolean;
    edit: boolean;
    inspection: boolean;
    pdf: boolean;
    destroy: boolean;
    /** Histórico de empréstimos e links para o empréstimo e o aluno beneficiário. */
    loans: boolean;
    viewLoan: boolean;
    viewStudent: boolean;
}

export interface ItemShowProps {
    item: ItemDetailsRecord;
    deficiencies: NamedRecord[];
    features: NamedRecord[];
    display: ItemDetailsDisplay;
    /** Vazio quando o usuário não pode listar empréstimos. */
    loans: LoanRecord[];
    can: ItemDetailsPermissions;
}

export interface ItemInspectionShowProps {
    item: { id: number; name: string };
    inspection: InspectionDetailsData;
    cover: ItemCoverImage | null;
    canSetCover: boolean;
}

export interface ItemCoverImage {
    id: number;
    name: string;
    url: string;
}
