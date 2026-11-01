import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Registro enviado por `TagController` (listagem, edição e visualização). */
export interface TagRecord {
    id: number;
    name: string;
    is_active: boolean;
    publications_count?: number;
}

export interface TagPaginator extends TableListPage {
    data: TagRecord[];
}

export type TagFilters = {
    name: string;
    is_active: string;
};

export interface TagListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}

export interface TagIndexProps {
    tags: TagPaginator;
    filters: Partial<TagFilters>;
    can: TagListPermissions;
}

export interface TagCreateProps {
    can: { store: boolean };
}

export interface TagEditProps {
    tag: TagRecord;
    can: { update: boolean };
}

export interface TagDetailsPermissions {
    edit: boolean;
    destroy: boolean;
}

export interface TagShowProps {
    tag: TagRecord;
    can: TagDetailsPermissions;
}
