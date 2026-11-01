import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Registro da listagem e da edição (`DisciplineController@index/edit`). */
export interface DisciplineRecord {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
}

export interface DisciplinePaginator extends TableListPage {
    data: DisciplineRecord[];
}

export type DisciplineFilters = {
    name: string;
    is_active: string;
};

export interface DisciplineListPermissions {
    create: boolean;
    view: boolean;
    delete: boolean;
}

export interface DisciplineIndexProps {
    disciplines: DisciplinePaginator;
    filters: Partial<DisciplineFilters>;
    can: DisciplineListPermissions;
}

export interface DisciplineEditProps {
    discipline: DisciplineRecord;
}

/** Dados da visualização, com os cursos vinculados (`DisciplineController@show`). */
export type DisciplineDetailsRecord = DisciplineRecord & {
    courses?: Array<{ id: number; name: string }>;
};

export interface DisciplineDetailsPermissions {
    update: boolean;
    delete: boolean;
}

export interface DisciplineShowProps {
    discipline: DisciplineDetailsRecord;
    can: DisciplineDetailsPermissions;
}
