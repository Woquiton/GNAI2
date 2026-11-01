import type { TableListPage } from '@/components/Tables/TableList/TableList';

export interface PositionPermission {
    id: number;
    name: string;
    slug: string;
}

/** Permissões agrupadas pela entidade traduzida (`PositionFormQuery::groupedPermissions`). */
export type GroupedPositionPermissions = Record<string, PositionPermission[]>;

/** Linha da listagem (`PositionController@index`). */
export interface PositionSummary {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
}

export interface PositionPaginator extends TableListPage {
    data: PositionSummary[];
}

export type PositionFilters = {
    name: string;
    description: string;
    is_active: string;
};

export interface PositionListPermissions {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
}

export interface PositionIndexProps {
    positions: PositionPaginator;
    filters: Partial<PositionFilters>;
    can: PositionListPermissions;
}

/** Registro usado na edição. */
export interface PositionRecord {
    id: number;
    name: string;
    description: string | null;
    permissions?: Array<Pick<PositionPermission, 'id'>>;
}

export interface PositionCreateProps {
    permissions: GroupedPositionPermissions;
}

export type PositionEditProps = PositionCreateProps & { position: PositionRecord };

/** Dados da visualização (`PositionController@show`). */
export interface PositionDetailsRecord {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    permissions?: Array<Pick<PositionPermission, 'id' | 'name'>>;
}

export interface PositionDetailsPermissions {
    update: boolean;
    delete: boolean;
}

export interface PositionShowProps {
    position: PositionDetailsRecord;
    /** Descrição sanitizada pelo `RichTextSanitizer`, com o texto padrão quando vazia. */
    descriptionHtml: string;
    can: PositionDetailsPermissions;
}
