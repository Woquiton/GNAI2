import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Registro enviado por `DeficiencyController` (listagem, edição e visualização). */
export interface DeficiencyRecord {
    id: number;
    name: string;
    cid_code: string | null;
    description: string | null;
    is_active: boolean;
}

export interface DeficiencyPaginator extends TableListPage {
    data: DeficiencyRecord[];
}

export type DeficiencyFilters = {
    name: string;
    cid_code: string;
    is_active: string;
};

export interface DeficiencyListPermissions {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
}

export interface DeficiencyIndexProps {
    deficiencies: DeficiencyPaginator;
    filters: Partial<DeficiencyFilters>;
    can: DeficiencyListPermissions;
}

export interface DeficiencyEditProps {
    deficiency: DeficiencyRecord;
}

export interface DeficiencyDetailsPermissions {
    update: boolean;
    delete: boolean;
}

export interface DeficiencyShowProps {
    deficiency: DeficiencyRecord;
    can: DeficiencyDetailsPermissions;
}
