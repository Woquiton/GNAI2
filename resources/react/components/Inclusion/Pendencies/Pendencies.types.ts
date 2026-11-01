import type { TableListPage } from '@/components/Tables/TableList/TableList';

export type PendencyListVariant = 'all' | 'my';

export interface PendencyListOption {
    value: string;
    label: string;
}

export interface PendencyPriorityOption extends PendencyListOption {
    color: string;
}

/** Linha das listagens (`ListPendenciesQuery` e `ListMyPendenciesQuery`). */
export interface PendencyListRecord {
    id: number;
    title: string;
    description: string | null;
    priority: string | null;
    due_date: string | null;
    is_completed: boolean;
    created_at: string | null;
    updated_at: string | null;
    creator: { name: string } | null;
    assigned_professional?: {
        id: number;
        person?: {
            name?: string | null;
        } | null;
    } | null;
}

export interface PendencyPaginator extends TableListPage {
    data: PendencyListRecord[];
}

export type PendencyListFilters = {
    title: string;
    assigned_to: string;
    priority: string;
    is_completed: string;
};

export interface PendencyListPermissions {
    create?: boolean;
    view: boolean;
    delete?: boolean;
    my?: boolean;
}

/** Props de `Index` e `My`; profissionais só existem na listagem geral. */
export interface PendencyListProps {
    pendencies: PendencyPaginator;
    priorities: PendencyPriorityOption[];
    professionals?: PendencyListOption[];
    filters: Partial<PendencyListFilters>;
    can: PendencyListPermissions;
}

/** Visualização (`PendencyShowPresenter`), com datas já formatadas. */
export interface PendencyDetailsRecord {
    id: number;
    title: string;
    description: string | null;
    priority_label: string | null;
    priority_color: string | null;
    due_date: string;
    is_completed: boolean;
    assigned_name: string;
    creator_name: string;
    created_at: string;
    updated_at: string;
}

export interface PendencyDetailsPermissions {
    edit: boolean;
    complete: boolean;
    delete: boolean;
}

export interface PendencyShowProps {
    pendency: PendencyDetailsRecord;
    can: PendencyDetailsPermissions;
}

export interface PendencyProfessionalOption {
    id: number;
    person?: {
        name?: string | null;
    } | null;
}

/** Opções do cadastro e da edição (`PendencyFormQuery`). */
export interface PendencyFormOptions {
    professionals: PendencyProfessionalOption[];
    priorities: Record<string, string>;
}

/** Pendência carregada na edição. */
export interface PendencyRecord {
    id: number;
    title: string;
    description: string | null;
    assigned_to: number | null;
    priority: string | null;
}

export type PendencyCreateProps = PendencyFormOptions;

export type PendencyEditProps = PendencyFormOptions & {
    pendency: PendencyRecord;
    pendencyForm: { due_date: string };
};
