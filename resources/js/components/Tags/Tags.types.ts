import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Registro enviado por `TagController` (listagem, edição e visualização). */
export interface TagRecord {
    id: number;
    name: string;
    is_active: boolean;
    module: 'publications' | 'inbox' | 'people';
    system_key?: string | null;
    module_label: string;
    color: string;
    publications_count?: number;
    mailbox_states_count?: number;
}

export interface TagPaginator extends TableListPage {
    data: TagRecord[];
}

export type TagFilters = {
    name: string;
    is_active: string;
    module: string;
};

export interface TagListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}

export interface TagIndexProps {
    modules: Record<string, string>;
    tags: TagPaginator;
    filters: Partial<TagFilters>;
    can: TagListPermissions;
}

export interface TagCreateProps {
    modules: Record<string, string>;
    can: { store: boolean };
}

export interface TagEditProps {
    modules: Record<string, string>;
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
