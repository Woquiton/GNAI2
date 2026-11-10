import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Registro enviado por `AccessibilityFeatureController` (listagem, edição e visualização). */
export interface AccessibilityFeatureRecord {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    items_count?: number;
}

export interface AccessibilityFeaturePaginator extends TableListPage {
    data: AccessibilityFeatureRecord[];
}

export type AccessibilityFeatureFilters = {
    created_from: string;
    created_to: string;
    name: string;
    is_active: string;
};

export interface AccessibilityFeatureListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}

export interface AccessibilityFeatureIndexProps {
    features: AccessibilityFeaturePaginator;
    filters: Partial<AccessibilityFeatureFilters>;
    can: AccessibilityFeatureListPermissions;
}

export interface AccessibilityFeatureCreateProps {
    can: { store: boolean };
}

export interface AccessibilityFeatureEditProps {
    accessibilityFeature: AccessibilityFeatureRecord;
    can: { update: boolean };
}

export interface AccessibilityFeatureDetailsPermissions {
    edit: boolean;
    destroy: boolean;
}

export interface AccessibilityFeatureShowProps {
    feature: AccessibilityFeatureRecord;
    display: { descriptionHtml: string };
    can: AccessibilityFeatureDetailsPermissions;
}
