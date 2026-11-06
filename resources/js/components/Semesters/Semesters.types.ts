import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Registro da listagem, da edição e da visualização (`SemesterController`). */
export interface SemesterRecord {
    id: number;
    year: number;
    term: number;
    label: string | null;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
}

export interface SemesterPaginator extends TableListPage {
    data: SemesterRecord[];
}

export type SemesterFilters = {
    year: string;
    term: string;
    label: string;
    is_current: string;
};

export interface SemesterListPermissions {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
}

export interface SemesterIndexProps {
    semesters: SemesterPaginator;
    filters: Partial<SemesterFilters>;
    can: SemesterListPermissions;
}

export interface SemesterEditProps {
    semester: SemesterRecord;
}

export interface SemesterDetailsPermissions {
    update: boolean;
    delete: boolean;
}

export interface SemesterShowProps {
    semester: SemesterRecord;
    can: SemesterDetailsPermissions;
}
