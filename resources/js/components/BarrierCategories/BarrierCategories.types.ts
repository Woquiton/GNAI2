import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Registro enviado por `BarrierCategoryController` (listagem, edição e visualização). */
export interface BarrierCategoryRecord {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    blocks_map: boolean;
    barriers_count?: number;
}

export interface BarrierCategoryPaginator extends TableListPage {
    data: BarrierCategoryRecord[];
}

export type BarrierCategoryFilters = {
    created_from: string;
    created_to: string;
    name: string;
    is_active: string;
};

export interface BarrierCategoryListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}

export interface BarrierCategoryIndexProps {
    categories: BarrierCategoryPaginator;
    filters: Partial<BarrierCategoryFilters>;
    can: BarrierCategoryListPermissions;
}

export interface BarrierCategoryCreateProps {
    can: { store: boolean };
}

export interface BarrierCategoryEditProps {
    barrierCategory: BarrierCategoryRecord;
    can: { update: boolean };
}

export interface BarrierCategoryDetailsPermissions {
    edit: boolean;
    destroy: boolean;
}

export interface BarrierCategoryShowProps {
    barrierCategory: BarrierCategoryRecord;
    display: { descriptionHtml: string };
    can: BarrierCategoryDetailsPermissions;
}
